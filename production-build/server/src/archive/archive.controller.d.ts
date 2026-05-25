import { ArchiveEngineService } from './archive.service';
export declare class ArchiveController {
    private readonly archiveService;
    constructor(archiveService: ArchiveEngineService);
    archiveEntity(model: 'Client' | 'Contract' | 'Quote' | 'Document', id: string, req: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.ClientStatus;
        bankReference: string | null;
        isTaxValidated: boolean;
        isContractBlocked: boolean;
        isInvoiceBlocked: boolean;
        isPaymentBlocked: boolean;
    } | {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        previousHash: string | null;
        currentHash: string;
        chainHash: string;
        legalHold: boolean;
        retentionUntil: Date | null;
    } | {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.QuoteStatus;
        correlationId: string | null;
        traceId: string | null;
        currencyCode: string;
        clientId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        desglosePrecios: import("@prisma/client/runtime/library").JsonValue;
    } | {
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
    }>;
    simulateRetention(): Promise<{
        success: boolean;
    }>;
}
