import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany();
  console.log('--- Tenants ---');
  console.log(tenants.map(t => t.name).join(', '));

  const roles = await prisma.role.findMany();
  console.log('\n--- Roles Count ---', roles.length);
  console.log(roles.map(r => r.name).join(', '));

  const permissions = await prisma.permission.findMany();
  console.log('\n--- Permissions Count ---', permissions.length);

  const users = await prisma.user.findMany({ include: { roles: { include: { role: true } } } });
  console.log('\n--- Users ---');
  for (const u of users) {
    console.log(`- ${u.email} (Roles: ${u.roles.map(ur => ur.role.name).join(', ')})`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
