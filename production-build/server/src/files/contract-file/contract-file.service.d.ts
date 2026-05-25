import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContractFileRepository } from './contract-file.repository';
import { CreateContractFileDto } from './contract-file.dto';
export declare class ContractFileService {
    private readonly repository;
    private readonly eventEmitter;
    constructor(repository: ContractFileRepository, eventEmitter: EventEmitter2);
    createContractFile(tenantId: string, dto: CreateContractFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        contractId: string;
        url: string;
    }>;
    getContractFiles(tenantId: string, contractId: string): Promise<{
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
