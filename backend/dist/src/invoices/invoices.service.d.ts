import { PrismaService } from '../prisma/prisma.service';
import { Prisma, InvoiceStatus } from '@prisma/client';
export declare class InvoicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: Omit<Prisma.InvoiceCreateInput, 'tenant' | 'tenantId' | 'status'>): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: Prisma.Decimal;
        contractSnapshotId: string;
        amountPaid: Prisma.Decimal;
        balanceDue: Prisma.Decimal;
        paymentStatus: string;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: Prisma.Decimal;
        contractSnapshotId: string;
        amountPaid: Prisma.Decimal;
        balanceDue: Prisma.Decimal;
        paymentStatus: string;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: Prisma.Decimal;
        contractSnapshotId: string;
        amountPaid: Prisma.Decimal;
        balanceDue: Prisma.Decimal;
        paymentStatus: string;
    }[]>;
    updateStatus(tenantId: string, id: string, status: InvoiceStatus): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        currencyCode: string;
        totalAmount: Prisma.Decimal;
        contractSnapshotId: string;
        amountPaid: Prisma.Decimal;
        balanceDue: Prisma.Decimal;
        paymentStatus: string;
    }>;
}
