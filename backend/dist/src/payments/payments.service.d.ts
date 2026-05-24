import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PaymentStatus } from '@prisma/client';
export declare class PaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: Omit<Prisma.PaymentCreateInput, 'tenant' | 'tenantId' | 'status'>): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        currencyCode: string;
        paymentAmount: Prisma.Decimal;
        invoiceId: string;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        currencyCode: string;
        paymentAmount: Prisma.Decimal;
        invoiceId: string;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        currencyCode: string;
        paymentAmount: Prisma.Decimal;
        invoiceId: string;
    }[]>;
    updateStatus(tenantId: string, id: string, status: PaymentStatus): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        currencyCode: string;
        paymentAmount: Prisma.Decimal;
        invoiceId: string;
    }>;
}
