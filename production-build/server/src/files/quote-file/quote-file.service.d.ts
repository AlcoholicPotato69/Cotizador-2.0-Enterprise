import { EventEmitter2 } from '@nestjs/event-emitter';
import { QuoteFileRepository } from './quote-file.repository';
import { CreateQuoteFileDto } from './quote-file.dto';
export declare class QuoteFileService {
    private readonly repository;
    private readonly eventEmitter;
    constructor(repository: QuoteFileRepository, eventEmitter: EventEmitter2);
    createQuoteFile(tenantId: string, dto: CreateQuoteFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        quoteId: string;
        url: string;
    }>;
    getQuoteFiles(tenantId: string, quoteId: string): Promise<{
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
