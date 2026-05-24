import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ContractStatus } from '@prisma/client';
export declare class ContractsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: Omit<Prisma.ContractCreateInput, 'tenant' | 'tenantId' | 'status'>): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }[]>;
    updateStatus(tenantId: string, id: string, status: ContractStatus): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }>;
}
