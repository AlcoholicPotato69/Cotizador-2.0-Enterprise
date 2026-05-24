import { PrismaService } from '../prisma/prisma.service';
import { Prisma, QuoteStatus } from '@prisma/client';
export declare class QuotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: Omit<Prisma.QuoteCreateInput, 'tenant' | 'tenantId' | 'status'>): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        currencyCode: string;
        totalAmount: Prisma.Decimal;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        currencyCode: string;
        totalAmount: Prisma.Decimal;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        currencyCode: string;
        totalAmount: Prisma.Decimal;
    }[]>;
    updateStatus(tenantId: string, id: string, status: QuoteStatus): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        currencyCode: string;
        totalAmount: Prisma.Decimal;
    }>;
}
