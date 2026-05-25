"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding initial data...');
    const systemTenant = await prisma.tenant.upsert({
        where: { id: '00000000-0000-0000-0000-000000000000' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000000',
            name: 'System Root Tenant',
        },
    });
    const permissions = [
        { action: 'create', resource: 'clients', name: 'clients.create' },
        { action: 'read', resource: 'clients', name: 'clients.read' },
        { action: 'update', resource: 'clients', name: 'clients.update' },
        { action: 'delete', resource: 'clients', name: 'clients.delete' },
        { action: 'create', resource: 'spaces', name: 'spaces.create' },
        { action: 'read', resource: 'spaces', name: 'spaces.read' },
        { action: 'update', resource: 'spaces', name: 'spaces.update' },
        { action: 'delete', resource: 'spaces', name: 'spaces.delete' },
        { action: 'create', resource: 'quotes', name: 'quotes.create' },
        { action: 'read', resource: 'quotes', name: 'quotes.read' },
        { action: 'update', resource: 'quotes', name: 'quotes.update' },
        { action: 'create', resource: 'contracts', name: 'contracts.create' },
        { action: 'read', resource: 'contracts', name: 'contracts.read' },
        { action: 'create', resource: 'invoices', name: 'invoices.create' },
        { action: 'read', resource: 'invoices', name: 'invoices.read' },
        { action: 'create', resource: 'payments', name: 'payments.create' },
        { action: 'read', resource: 'payments', name: 'payments.read' },
        { action: 'manage', resource: 'users', name: 'users.manage' },
        { action: 'manage', resource: 'roles', name: 'roles.manage' },
        { action: 'read', resource: 'audit', name: 'audit.read' },
    ];
    const createdPermissions = [];
    for (const perm of permissions) {
        const created = await prisma.permission.upsert({
            where: {
                tenantId_name: {
                    tenantId: systemTenant.id,
                    name: perm.name,
                },
            },
            update: {},
            create: {
                tenantId: systemTenant.id,
                name: perm.name,
                action: perm.action,
                resource: perm.resource,
            },
        });
        createdPermissions.push(created);
    }
    const rolesData = [
        { name: 'SYSTEM_ADMIN', permissions: createdPermissions.map(p => p.name) },
        { name: 'TENANT_ADMIN', permissions: createdPermissions.map(p => p.name) },
        { name: 'SALES_MANAGER', permissions: ['clients.create', 'clients.read', 'clients.update', 'quotes.create', 'quotes.read', 'quotes.update', 'contracts.read', 'spaces.read'] },
        { name: 'OPERATIONS_MANAGER', permissions: ['spaces.create', 'spaces.read', 'spaces.update', 'spaces.delete'] },
        { name: 'FINANCE_MANAGER', permissions: ['invoices.create', 'invoices.read', 'payments.create', 'payments.read', 'clients.read', 'contracts.read'] },
        { name: 'AUDITOR', permissions: ['clients.read', 'spaces.read', 'quotes.read', 'contracts.read', 'invoices.read', 'payments.read', 'audit.read'] },
        { name: 'BASIC_USER', permissions: ['clients.read', 'spaces.read'] },
    ];
    for (const roleDef of rolesData) {
        const role = await prisma.role.upsert({
            where: {
                tenantId_name: {
                    tenantId: systemTenant.id,
                    name: roleDef.name,
                },
            },
            update: {},
            create: {
                tenantId: systemTenant.id,
                name: roleDef.name,
                description: `Base role: ${roleDef.name}`,
            },
        });
        for (const permName of roleDef.permissions) {
            const permission = createdPermissions.find(p => p.name === permName);
            if (permission) {
                await prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: role.id,
                            permissionId: permission.id,
                        },
                    },
                    update: {},
                    create: {
                        tenantId: systemTenant.id,
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                });
            }
        }
    }
    console.log('Creating Tenants (pm and cp)...');
    const pmTenant = await prisma.tenant.upsert({ where: { id: 'pm' }, update: {}, create: { id: 'pm', name: 'Plaza Mayor' } });
    const cpTenant = await prisma.tenant.upsert({ where: { id: 'cp' }, update: {}, create: { id: 'cp', name: 'Casa de Piedra' } });
    const customRoles = [
        { name: 'ADMIN_ROLE', perms: ['admin.access'] },
        { name: 'MARKETING_ROLE', perms: ['marketing.read'] },
        { name: 'LEGAL_ROLE', perms: ['legal.write'] },
        { name: 'FINANCE_ROLE', perms: ['finance.view'] }
    ];
    for (const cr of customRoles) {
        for (const p of cr.perms) {
            await prisma.permission.upsert({
                where: { tenantId_name: { tenantId: systemTenant.id, name: p } },
                update: {},
                create: { tenantId: systemTenant.id, name: p, action: p.split('.')[1] || 'manage', resource: p.split('.')[0] || 'all' }
            });
        }
        const r = await prisma.role.upsert({
            where: { tenantId_name: { tenantId: systemTenant.id, name: cr.name } },
            update: {},
            create: { tenantId: systemTenant.id, name: cr.name, description: cr.name }
        });
        for (const p of cr.perms) {
            const perm = await prisma.permission.findUnique({ where: { tenantId_name: { tenantId: systemTenant.id, name: p } } });
            if (perm) {
                await prisma.rolePermission.upsert({
                    where: { roleId_permissionId: { roleId: r.id, permissionId: perm.id } },
                    update: {},
                    create: { tenantId: systemTenant.id, roleId: r.id, permissionId: perm.id }
                });
            }
        }
    }
    const hash = '$2b$10$tONS0fX8HFMTVbNpHrb7XOkPIkVygMuLlEnS0JaR7t8SfKBvBN4l.';
    const users = [
        { email: 'superadmin@cotizador.com', tId: systemTenant.id, role: 'SYSTEM_ADMIN' },
        { email: 'admin_pm@cotizador.com', tId: pmTenant.id, role: 'ADMIN_ROLE' },
        { email: 'admin_cp@cotizador.com', tId: cpTenant.id, role: 'ADMIN_ROLE' },
        { email: 'marketing_pm@cotizador.com', tId: pmTenant.id, role: 'MARKETING_ROLE' },
        { email: 'marketing_cp@cotizador.com', tId: cpTenant.id, role: 'MARKETING_ROLE' },
        { email: 'juridico_global@cotizador.com', tId: systemTenant.id, role: 'LEGAL_ROLE' },
        { email: 'finanzas_global@cotizador.com', tId: systemTenant.id, role: 'FINANCE_ROLE' }
    ];
    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: { passwordHash: hash },
            create: {
                tenantId: u.tId,
                email: u.email,
                passwordHash: hash,
                firstName: u.email.split('_')[0].split('@')[0],
                lastName: 'User',
                isActive: true,
            },
        });
        const role = await prisma.role.findFirst({ where: { tenantId: systemTenant.id, name: u.role } });
        if (role) {
            await prisma.userRole.upsert({
                where: { userId_roleId: { userId: user.id, roleId: role.id } },
                update: {},
                create: { tenantId: u.tId, userId: user.id, roleId: role.id },
            });
        }
    }
    console.log('Seeding completed successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map