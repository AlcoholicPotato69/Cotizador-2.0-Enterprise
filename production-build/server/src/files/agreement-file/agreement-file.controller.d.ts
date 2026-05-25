import { AgreementFileService } from './agreement-file.service';
import { CreateAgreementFileDto } from './agreement-file.dto';
export declare class AgreementFileController {
    private readonly agreementFileService;
    constructor(agreementFileService: AgreementFileService);
    createAgreementFile(tenantId: string, dto: CreateAgreementFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        url: string;
        agreementId: string;
    }>;
    getAgreementFiles(tenantId: string, agreementId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        url: string;
        agreementId: string;
    }[]>;
}
