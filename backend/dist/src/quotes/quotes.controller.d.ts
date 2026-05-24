import { QuotesService } from './quotes.service';
import { TenantContextService } from '../common/tenant-context.service';
export declare class QuotesController {
    private readonly quotesService;
    private readonly tenantContext;
    constructor(quotesService: QuotesService, tenantContext: TenantContextService);
    create(createDto: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        currencyCode: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    findAll(): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        currencyCode: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        currencyCode: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        currencyCode: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
    }>;
}
