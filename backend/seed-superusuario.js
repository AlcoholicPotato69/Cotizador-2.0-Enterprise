/**
 * Seed script to create/update superusuario@cotizador.com
 * with SYSTEM_ADMIN role (all permissions).
 *
 * Run: node seed-superusuario.js
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('=== Creating superusuario@cotizador.com ===');

  const SYSTEM_TENANT_ID = '00000000-0000-0000-0000-000000000000';

  // 1. Ensure System Tenant exists
  await prisma.tenant.upsert({
    where: { id: SYSTEM_TENANT_ID },
    update: {},
    create: { id: SYSTEM_TENANT_ID, name: 'System Root Tenant' },
  });

  // 2. Hash password
  const password = 'Admin123!';
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Upsert the superusuario user
  const user = await prisma.user.upsert({
    where: { email: 'superusuario@cotizador.com' },
    update: {
      passwordHash,
      firstName: 'Super',
      lastName: 'Usuario',
      isActive: true,
    },
    create: {
      tenantId: SYSTEM_TENANT_ID,
      email: 'superusuario@cotizador.com',
      passwordHash,
      firstName: 'Super',
      lastName: 'Usuario',
      isActive: true,
    },
  });

  console.log(`User created/updated: ${user.id} (${user.email})`);

  // 4. Find or create SYSTEM_ADMIN role
  let role = await prisma.role.findFirst({
    where: { tenantId: SYSTEM_TENANT_ID, name: 'SYSTEM_ADMIN' },
  });

  if (!role) {
    role = await prisma.role.create({
      data: {
        tenantId: SYSTEM_TENANT_ID,
        name: 'SYSTEM_ADMIN',
        description: 'Full system administrator with all permissions',
      },
    });
  }

  console.log(`Role: ${role.name} (${role.id})`);

  // 5. Assign role to user
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: {
      tenantId: SYSTEM_TENANT_ID,
      userId: user.id,
      roleId: role.id,
    },
  });

  // 6. Ensure ALL permissions exist and are linked to SYSTEM_ADMIN
  const allPermissions = await prisma.permission.findMany({
    where: { tenantId: SYSTEM_TENANT_ID },
  });

  console.log(`Found ${allPermissions.length} permissions in system tenant`);

  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: role.id, permissionId: perm.id },
      },
      update: {},
      create: {
        tenantId: SYSTEM_TENANT_ID,
        roleId: role.id,
        permissionId: perm.id,
      },
    });
  }

  console.log(`\n✅ superusuario@cotizador.com is now SYSTEM_ADMIN`);
  console.log(`   Email: superusuario@cotizador.com`);
  console.log(`   Password: ${password}`);
  console.log(`   Role: SYSTEM_ADMIN`);
  console.log(`   Permissions: ALL (${allPermissions.length} total)`);
  console.log(`   Tenant: System Root (${SYSTEM_TENANT_ID})`);
}

main()
  .catch((e) => {
    console.error('SEED ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
