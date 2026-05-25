import { QuoteFileService } from './quote-file.service';
import { CreateQuoteFileDto } from './quote-file.dto';
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
export declare class QuoteFileController {
    private readonly service;
    constructor(service: QuoteFileService);
    createQuoteFile(req: AuthenticatedRequest, dto: CreateQuoteFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        quoteId: string;
        url: string;
    }>;
    getQuoteFiles(req: AuthenticatedRequest, quoteId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        quoteId: string;
        url: string;
    }[]>;
}
export {};
