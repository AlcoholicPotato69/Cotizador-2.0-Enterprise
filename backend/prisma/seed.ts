import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Create a default System Tenant (for global configurations and staff)
  const systemTenant = await prisma.tenant.upsert({
    where: { id: '00000000-0000-0000-0000-000000000000' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'System Root Tenant',
    },
  });

  // 2. Define Base Permissions
  const permissions = [
    // CRM
    { action: 'create', resource: 'clients', name: 'clients.create' },
    { action: 'read', resource: 'clients', name: 'clients.read' },
    { action: 'update', resource: 'clients', name: 'clients.update' },
    { action: 'delete', resource: 'clients', name: 'clients.delete' },
    
    // Spaces / Operations
    { action: 'create', resource: 'spaces', name: 'spaces.create' },
    { action: 'read', resource: 'spaces', name: 'spaces.read' },
    { action: 'update', resource: 'spaces', name: 'spaces.update' },
    { action: 'delete', resource: 'spaces', name: 'spaces.delete' },
    
    // Commercial (Quotes & Contracts)
    { action: 'create', resource: 'quotes', name: 'quotes.create' },
    { action: 'read', resource: 'quotes', name: 'quotes.read' },
    { action: 'update', resource: 'quotes', name: 'quotes.update' },
    { action: 'create', resource: 'contracts', name: 'contracts.create' },
    { action: 'read', resource: 'contracts', name: 'contracts.read' },
    
    // Financial (Invoices & Payments)
    { action: 'create', resource: 'invoices', name: 'invoices.create' },
    { action: 'read', resource: 'invoices', name: 'invoices.read' },
    { action: 'create', resource: 'payments', name: 'payments.create' },
    { action: 'read', resource: 'payments', name: 'payments.read' },
    
    // System / Admin
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

  // 3. Define Roles
  const rolesData = [
    { name: 'SYSTEM_ADMIN', permissions: createdPermissions.map(p => p.name) }, // All permissions
    { name: 'TENANT_ADMIN', permissions: createdPermissions.map(p => p.name) }, // All permissions (scoped by tenant)
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

    // Link permissions to role
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
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
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
