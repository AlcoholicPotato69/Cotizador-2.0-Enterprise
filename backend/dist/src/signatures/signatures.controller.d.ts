import { SignaturesService } from './signatures.service';
import { TenantContextService } from '../common/tenant-context.service';
export declare class SignaturesController {
    private readonly signaturesService;
    private readonly tenantContext;
    constructor(signaturesService: SignaturesService, tenantContext: TenantContextService);
    signContract(contractId: string, signatureData: any): Promise<{
        id: string;
        tenantId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        currencyCode: string;
        quoteSnapshotId: string;
        templateVersion: string;
        templateHash: string;
    }>;
}
