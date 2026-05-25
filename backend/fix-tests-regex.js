const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.spec.ts');
files.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (file.includes('.controller.spec.ts')) {
        if (!text.includes('overrideGuard(JwtAuthGuard)')) {
            text = text.replace(/\}\)\.compile\(\);/, `})
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard).useValue({ canActivate: () => true })
      .overrideGuard(TenantIsolationGuard).useValue({ canActivate: () => true })
      .compile();`);
            if (!text.includes('JwtAuthGuard')) text = `import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';\n` + text;
            if (!text.includes('PermissionsGuard')) text = `import { PermissionsGuard } from '../auth/guards/permissions.guard';\n` + text;
            if (!text.includes('TenantIsolationGuard')) text = `import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';\n` + text;
            
            const depth = file.replace(/\\/g, '/').split('/').length - file.replace(/\\/g, '/').indexOf('src/') - 2;
            let prefix = depth > 0 ? '../'.repeat(depth) : './';
            if (prefix === '') prefix = './';
            text = text.replace(/\.\.\/auth/g, `${prefix}auth`);
            
            changed = true;
        }
    }
    
    if (text.includes('ReceiptsService') && !text.includes('EventEmitter')) {
        text = text.replace(/providers: \[ReceiptsService, \{ provide: PrismaService, useValue: \{\} \}\]/, `providers: [ReceiptsService, { provide: PrismaService, useValue: {} }, { provide: require('@nestjs/event-emitter').EventEmitter2, useValue: {} }]`);
        changed = true;
    }

    if (changed) fs.writeFileSync(file, text);
});
console.log('Fixed tests via regex');
