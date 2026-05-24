import { PrismaService } from '../prisma/prisma.service';
export declare class SignaturesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    signContract(tenantId: string, contractId: string, signatureData: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }>;
}
