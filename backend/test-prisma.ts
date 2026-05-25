import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('Testing connection...');
  const user = await prisma.user.findFirst();
  console.log('Success:', user ? user.email : 'No users');
}
main().catch(e => console.error('Error:', e)).finally(() => prisma.$disconnect());
