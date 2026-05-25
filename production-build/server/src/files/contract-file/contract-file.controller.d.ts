import { ContractFileService } from './contract-file.service';
import { CreateContractFileDto } from './contract-file.dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        tenantId: string;
        role: string;
        email: string;
        permissions: string[];
    };
}
export declare class ContractFileController {
    private readonly service;
    constructor(service: ContractFileService);
    createContractFile(req: AuthenticatedRequest, dto: CreateContractFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        contractId: string;
        url: string;
    }>;
    getContractFiles(req: AuthenticatedRequest, contractId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        contractId: string;
        url: string;
    }[]>;
}
export {};
