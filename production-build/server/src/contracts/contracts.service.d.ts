import { PrismaService } from '../prisma/prisma.service';
export declare class ContractsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getContract(id: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.ContractStatus;
        correlationId: string | null;
        traceId: string | null;
        currencyCode: string;
        clientId: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
        quoteId: string | null;
    } | null>;
}
