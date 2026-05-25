import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PaymentAllocation } from '@prisma/client';
export declare class PaymentAllocationsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tx: Prisma.TransactionClient, data: Prisma.PaymentAllocationUncheckedCreateInput): Promise<PaymentAllocation>;
    findByPaymentId(tenantId: string, paymentId: string): Promise<PaymentAllocation[]>;
    findByInvoiceId(tenantId: string, invoiceId: string): Promise<PaymentAllocation[]>;
}
