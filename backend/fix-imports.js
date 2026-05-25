const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.controller.spec.ts');
files.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (text.includes('overrideGuard(JwtAuthGuard)') && !text.includes('import { JwtAuthGuard }')) {
        const parts = file.replace(/\\/g, '/').split('/');
        const srcIndex = parts.indexOf('src');
        const depth = parts.length - srcIndex - 2;
        let prefix = depth > 0 ? '../'.repeat(depth) : './';
        if (prefix === '') prefix = './';
        
        text = `import { JwtAuthGuard } from '${prefix}auth/guards/jwt-auth.guard';\n` + 
               `import { PermissionsGuard } from '${prefix}auth/guards/permissions.guard';\n` + 
               `import { TenantIsolationGuard } from '${prefix}auth/guards/tenant-isolation.guard';\n` + text;
        changed = true;
    }

    if (changed) fs.writeFileSync(file, text);
});
console.log('Fixed imports for controllers');
