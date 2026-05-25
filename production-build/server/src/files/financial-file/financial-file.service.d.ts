import { EventEmitter2 } from '@nestjs/event-emitter';
import { FinancialFileRepository } from './financial-file.repository';
import { CreateFinancialFileDto } from './financial-file.dto';
export declare class FinancialFileService {
    private readonly repository;
    private readonly eventEmitter;
    constructor(repository: FinancialFileRepository, eventEmitter: EventEmitter2);
    createFinancialFile(tenantId: string, dto: CreateFinancialFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        invoiceId: string;
        url: string;
    }>;
    getFinancialFiles(tenantId: string, invoiceId: string): Promise<{
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
