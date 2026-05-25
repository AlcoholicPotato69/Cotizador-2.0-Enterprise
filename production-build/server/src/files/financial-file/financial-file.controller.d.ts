import { FinancialFileService } from './financial-file.service';
import { CreateFinancialFileDto } from './financial-file.dto';
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
export declare class FinancialFileController {
    private readonly service;
    constructor(service: FinancialFileService);
    createFinancialFile(req: AuthenticatedRequest, dto: CreateFinancialFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        invoiceId: string;
        url: string;
    }>;
    getFinancialFiles(req: AuthenticatedRequest, invoiceId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        invoiceId: string;
        url: string;
    }[]>;
}
export {};
