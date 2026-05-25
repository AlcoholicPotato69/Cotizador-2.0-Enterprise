import { ClientFileRepository } from '../client-file/client-file.repository';
import { QuoteFileRepository } from '../quote-file/quote-file.repository';
import { ContractFileRepository } from '../contract-file/contract-file.repository';
import { AgreementFileRepository } from '../agreement-file/agreement-file.repository';
import { FinancialFileRepository } from '../financial-file/financial-file.repository';
export declare class DocumentViewerService {
    private readonly clientFileRepo;
    private readonly quoteFileRepo;
    private readonly contractFileRepo;
    private readonly agreementFileRepo;
    private readonly financialFileRepo;
    private readonly secretKey;
    constructor(clientFileRepo: ClientFileRepository, quoteFileRepo: QuoteFileRepository, contractFileRepo: ContractFileRepository, agreementFileRepo: AgreementFileRepository, financialFileRepo: FinancialFileRepository);
    generateSignedUrl(tenantId: string, entityType: string, fileId: string, expiresInMinutes?: number): string;
    viewDocument(tenantId: string, entityType: string, fileId: string, expiresAt: number, signature: string): Promise<{
        url: string;
    }>;
}
