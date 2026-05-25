import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Payment } from '@prisma/client';
export declare class PaymentsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tx: Prisma.TransactionClient, data: Prisma.PaymentUncheckedCreateInput): Promise<Payment>;
    findByIdForUpdate(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Payment>;
    findById(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Payment | null>;
    update(tx: Prisma.TransactionClient, tenantId: string, id: string, data: Prisma.PaymentUpdateInput): Promise<Payment>;
}
