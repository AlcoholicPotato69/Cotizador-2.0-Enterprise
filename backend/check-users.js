const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/cotizador_db' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log('Found ' + users.length + ' users.');
  users.forEach(u => console.log(u.email));
}

main().catch(console.error).finally(() => prisma.$disconnect());
