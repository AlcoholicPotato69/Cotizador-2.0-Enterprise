const { execSync } = require('child_process');
const fs = require('fs');
const { Project, SyntaxKind } = require('ts-morph');

function runTests() {
    try {
        console.log('Running tests...');
        execSync('npm run test -- --json --outputFile=temp-test-results.json', { stdio: 'pipe' });
        return true;
    } catch (e) {
        return false;
    }
}

async function fixTests() {
    let project = new Project();
    project.addSourceFilesAtPaths("src/**/*.spec.ts");
    
    let iterations = 0;
    while (iterations < 10) {
        iterations++;
        const passed = runTests();
        if (passed) {
            console.log('All tests passed!');
            break;
        }
        
        const data = JSON.parse(fs.readFileSync('temp-test-results.json', 'utf8'));
        const failedTests = data.testResults.filter(r => r.status === 'failed');
        let fixedSomething = false;
        
        for (const test of failedTests) {
            const filePath = test.name;
            const sourceFile = project.getSourceFile(filePath);
            if (!sourceFile) continue;
            
            const errors = test.message;
            const missingDeps = new Set();
            
            const regex = /Nest can't resolve dependencies of the [A-Za-z0-9_]+ \((.*)\)/g;
            let match;
            while ((match = regex.exec(errors)) !== null) {
                const argRegex = /argument ([A-Za-z0-9_]+) at index/g;
                let argMatch;
                while ((argMatch = argRegex.exec(errors)) !== null) {
                    missingDeps.add(argMatch[1]);
                }
            }

            let needsGuardOverride = false;
            if (errors.includes('JwtAuthGuard') || errors.includes('PermissionsGuard') || errors.includes('TenantIsolationGuard')) {
                needsGuardOverride = true;
            }
            
            if (missingDeps.size > 0 || needsGuardOverride) {
                let changed = false;
                const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
                for (const call of calls) {
                    if (call.getExpression().getText() === 'Test.createTestingModule') {
                        const obj = call.getArguments()[0];
                        if (obj && obj.getKind() === SyntaxKind.ObjectLiteralExpression) {
                            const providersProp = obj.getProperty('providers');
                            if (missingDeps.size > 0) {
                                if (providersProp && providersProp.getKind() === SyntaxKind.PropertyAssignment) {
                                    const arr = providersProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
                                    if (arr) {
                                        for (const dep of missingDeps) {
                                            if (['Reflector', 'ModuleRef', 'EventEmitter'].includes(dep)) continue;
                                            const depText = `{ provide: ${dep}, useValue: {} }`;
                                            if (!arr.getElements().some(e => e.getText().includes(dep))) {
                                                arr.addElement(depText);
                                                changed = true;
                                                
                                                const hasImport = sourceFile.getImportDeclarations().some(i => i.getText().includes(dep));
                                                if (!hasImport) {
                                                    if (dep === 'PrismaService') {
                                                        sourceFile.addImportDeclaration({ namedImports: ['PrismaService'], moduleSpecifier: '../prisma/prisma.service' });
                                                    } else if (dep === 'JwtService') {
                                                        sourceFile.addImportDeclaration({ namedImports: ['JwtService'], moduleSpecifier: '@nestjs/jwt' });
                                                    } else if (dep === 'DomainEventPublisher') {
                                                        sourceFile.addImportDeclaration({ namedImports: ['DomainEventPublisher'], moduleSpecifier: '../common/events/domain-event.publisher' });
                                                    } else if (dep === 'OutboxService') {
                                                        sourceFile.addImportDeclaration({ namedImports: ['OutboxService'], moduleSpecifier: '../common/outbox/outbox.service' });
                                                    } else if (dep === 'PdfService') {
                                                        sourceFile.addImportDeclaration({ namedImports: ['PdfService'], moduleSpecifier: '../pdf/pdf.service' });
                                                    } else if (dep.endsWith('Service')) {
                                                        sourceFile.addImportDeclaration({ namedImports: [dep], moduleSpecifier: `./${dep.replace('Service', '').toLowerCase()}.service` });
                                                    } else if (dep.endsWith('Repository')) {
                                                        sourceFile.addImportDeclaration({ namedImports: [dep], moduleSpecifier: `./${dep.replace('Repository', '').toLowerCase()}.repository` });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    obj.addPropertyAssignment({
                                        name: 'providers',
                                        initializer: `[${Array.from(missingDeps).filter(d => !['Reflector', 'ModuleRef', 'EventEmitter'].includes(d)).map(d => `{ provide: ${d}, useValue: {} }`).join(', ')}]`
                                    });
                                    changed = true;
                                    for (const dep of missingDeps) {
                                        if (dep === 'PrismaService') sourceFile.addImportDeclaration({ namedImports: ['PrismaService'], moduleSpecifier: '../prisma/prisma.service' });
                                        if (dep === 'JwtService') sourceFile.addImportDeclaration({ namedImports: ['JwtService'], moduleSpecifier: '@nestjs/jwt' });
                                        if (dep === 'DomainEventPublisher') sourceFile.addImportDeclaration({ namedImports: ['DomainEventPublisher'], moduleSpecifier: '../common/events/domain-event.publisher' });
                                    }
                                }
                            }
                        }
                    }
                }

                if (needsGuardOverride && filePath.includes('controller.spec.ts')) {
                    let text = sourceFile.getFullText();
                    if (!text.includes('overrideGuard(JwtAuthGuard)')) {
                        text = text.replace(/\}\)\.compile\(\);/, `})
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard).useValue({ canActivate: () => true })
      .overrideGuard(TenantIsolationGuard).useValue({ canActivate: () => true })
      .compile();`);
                        if (!text.includes('JwtAuthGuard')) text = `import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';\n` + text;
                        if (!text.includes('PermissionsGuard')) text = `import { PermissionsGuard } from '../auth/guards/permissions.guard';\n` + text;
                        if (!text.includes('TenantIsolationGuard')) text = `import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';\n` + text;
                        
                        const depth = filePath.replace(/\\/g, '/').split('/').length - filePath.replace(/\\/g, '/').indexOf('src/') - 2;
                        let prefix = depth > 0 ? '../'.repeat(depth) : './';
                        if (prefix === '') prefix = './';
                        text = text.replace(/\.\.\/auth/g, `${prefix}auth`);
                        
                        sourceFile.replaceWithText(text);
                        changed = true;
                    }
                }
                
                if (changed) {
                    console.log(`Fixed ${filePath}`);
                    fixedSomething = true;
                }
            }
        }
        
        if (fixedSomething) {
            project.saveSync();
        } else {
            console.log('No more automated fixes could be applied.');
            break;
        }
    }
}

fixTests().catch(console.error);
