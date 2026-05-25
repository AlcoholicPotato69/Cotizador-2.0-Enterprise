import { SignaturesService } from './signatures.service';
import { SignContractDto } from './dto/sign-contract.dto';
export declare class SignaturesController {
    private readonly service;
    constructor(service: SignaturesService);
    getSignature(id: string, user: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        contractId: string;
        participantName: string;
        participantRole: string;
        signatureHash: string;
        ipAddress: string | null;
        signedAt: Date;
    }>;
    signContract(dto: SignContractDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        contractId: string;
        participantName: string;
        participantRole: string;
        signatureHash: string;
        ipAddress: string | null;
        signedAt: Date;
    }>;
}
