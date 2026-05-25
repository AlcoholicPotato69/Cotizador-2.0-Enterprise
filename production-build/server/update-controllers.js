"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const path = __importStar(require("path"));
const project = new ts_morph_1.Project();
project.addSourceFilesAtPaths('src/**/*.controller.ts');
const sourceFiles = project.getSourceFiles();
const domainMap = {
    'clients': 'clients',
    'catalog': 'catalog',
    'quotes': 'quotes',
    'files': 'files',
    'contracts': 'contracts',
    'agreements': 'agreements',
    'invoices': 'invoices',
    'payments': 'payments',
    'agenda': 'agenda',
    'approvals': 'approvals',
    'archive': 'archive',
    'audit': 'audit',
    'auth': 'auth',
    'customer-credits': 'customer_credits',
    'documents': 'documents',
    'feature-flags': 'feature_flags',
    'health': 'health',
    'notifications': 'notifications',
    'numbering': 'numbering',
    'rbac': 'rbac',
    'receipts': 'receipts',
    'regulations': 'regulations',
    'reports': 'reports',
    'reviews': 'reviews',
    'search': 'search',
    'settings': 'settings',
    'signatures': 'signatures',
    'snapshots': 'snapshots',
    'spaces': 'spaces',
    'storage': 'storage',
    'templates': 'templates',
    'tenants': 'tenants',
    'workflows': 'workflows',
};
sourceFiles.forEach(sourceFile => {
    const classes = sourceFile.getClasses();
    if (classes.length === 0)
        return;
    const controllerClass = classes[0];
    const filePath = sourceFile.getFilePath();
    let domain = 'common';
    for (const key of Object.keys(domainMap)) {
        if (filePath.includes(`/${key}/`) || filePath.includes(`\\${key}\\`)) {
            domain = domainMap[key];
            break;
        }
    }
    controllerClass.getMethods().forEach(method => {
        const rolesDecorator = method.getDecorator('Roles');
        if (rolesDecorator) {
            rolesDecorator.remove();
        }
        const permissionsDecorator = method.getDecorator('Permissions');
        if (!permissionsDecorator) {
            const methodName = method.getName();
            let action = 'read';
            if (['create', 'update', 'post', 'put', 'patch', 'add', 'set'].some(a => methodName.toLowerCase().includes(a))) {
                action = 'write';
            }
            else if (['delete', 'remove'].some(a => methodName.toLowerCase().includes(a))) {
                action = 'delete';
            }
            const hasHttpMethod = method.getDecorators().some(d => ['Get', 'Post', 'Put', 'Delete', 'Patch', 'All'].includes(d.getName()));
            if (hasHttpMethod) {
                method.addDecorator({
                    name: 'Permissions',
                    arguments: [`'${domain}:${action}'`],
                });
            }
        }
    });
    let hasUseGuards = false;
    let useGuardsArgs = [];
    const useGuardsDecorator = controllerClass.getDecorator('UseGuards');
    if (useGuardsDecorator) {
        hasUseGuards = true;
        useGuardsArgs = useGuardsDecorator.getArguments().map(arg => arg.getText());
        useGuardsDecorator.remove();
    }
    const rolesDecoratorCls = controllerClass.getDecorator('Roles');
    if (rolesDecoratorCls) {
        rolesDecoratorCls.remove();
    }
    const newArgs = [];
    if (!useGuardsArgs.includes('JwtAuthGuard'))
        newArgs.push('JwtAuthGuard');
    if (!useGuardsArgs.includes('PermissionsGuard'))
        newArgs.push('PermissionsGuard');
    if (!useGuardsArgs.includes('TenantIsolationGuard'))
        newArgs.push('TenantIsolationGuard');
    const combinedArgs = Array.from(new Set([...useGuardsArgs.filter(a => a !== 'RolesGuard'), ...newArgs]));
    controllerClass.addDecorator({
        name: 'UseGuards',
        arguments: combinedArgs
    });
    const imports = sourceFile.getImportDeclarations();
    imports.forEach(imp => {
        const defaultImport = imp.getDefaultImport();
        const namedImports = imp.getNamedImports();
        const namesToRemove = ['RolesGuard', 'Roles'];
        let removedAny = false;
        namedImports.forEach(ni => {
            if (namesToRemove.includes(ni.getName())) {
                ni.remove();
                removedAny = true;
            }
        });
        if (removedAny && imp.getNamedImports().length === 0 && !defaultImport) {
            imp.remove();
        }
    });
    let hasJwtAuthGuard = false;
    let hasPermissionsGuard = false;
    let hasTenantIsolationGuard = false;
    let hasPermissions = false;
    sourceFile.getImportDeclarations().forEach(imp => {
        const namedImports = imp.getNamedImports().map(ni => ni.getName());
        if (namedImports.includes('JwtAuthGuard'))
            hasJwtAuthGuard = true;
        if (namedImports.includes('PermissionsGuard'))
            hasPermissionsGuard = true;
        if (namedImports.includes('TenantIsolationGuard'))
            hasTenantIsolationGuard = true;
        if (namedImports.includes('Permissions'))
            hasPermissions = true;
    });
    const getRelativePath = (toPath) => {
        const fromPath = path.dirname(filePath);
        let rel = path.relative(fromPath, toPath).replace(/\\/g, '/');
        if (!rel.startsWith('.')) {
            rel = './' + rel;
        }
        return rel;
    };
    const guardsDir = path.resolve('src/auth/guards');
    const decoratorsDir = path.resolve('src/auth/decorators');
    if (!hasJwtAuthGuard) {
        sourceFile.addImportDeclaration({
            namedImports: ['JwtAuthGuard'],
            moduleSpecifier: getRelativePath(path.join(guardsDir, 'jwt-auth.guard'))
        });
    }
    if (!hasPermissionsGuard) {
        sourceFile.addImportDeclaration({
            namedImports: ['PermissionsGuard'],
            moduleSpecifier: getRelativePath(path.join(guardsDir, 'permissions.guard'))
        });
    }
    if (!hasTenantIsolationGuard) {
        sourceFile.addImportDeclaration({
            namedImports: ['TenantIsolationGuard'],
            moduleSpecifier: getRelativePath(path.join(guardsDir, 'tenant-isolation.guard'))
        });
    }
    if (!hasPermissions) {
        sourceFile.addImportDeclaration({
            namedImports: ['Permissions'],
            moduleSpecifier: getRelativePath(path.join(decoratorsDir, 'permissions.decorator'))
        });
    }
});
project.saveSync();
console.log('Done!');
//# sourceMappingURL=update-controllers.js.map