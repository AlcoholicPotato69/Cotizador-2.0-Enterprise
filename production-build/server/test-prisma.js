"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Testing connection...');
    const user = await prisma.user.findFirst();
    console.log('Success:', user ? user.email : 'No users');
}
main().catch(e => console.error('Error:', e)).finally(() => prisma.$disconnect());
//# sourceMappingURL=test-prisma.js.map