import { ContractsService } from './contracts.service';
import { TenantContextService } from '../common/tenant-context.service';
export declare class ContractsController {
    private readonly contractsService;
    private readonly tenantContext;
    constructor(contractsService: ContractsService, tenantContext: TenantContextService);
    create(createDto: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }>;
    findAll(): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }>;
}
