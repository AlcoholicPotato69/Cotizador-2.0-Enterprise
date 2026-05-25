import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Invoice } from '@prisma/client';
export declare class InvoicesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tx: Prisma.TransactionClient, data: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice>;
    findByIdForUpdate(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Invoice>;
    findById(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Invoice | null>;
    update(tx: Prisma.TransactionClient, tenantId: string, id: string, data: Prisma.InvoiceUpdateInput): Promise<Invoice>;
}
