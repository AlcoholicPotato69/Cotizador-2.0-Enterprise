import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientFileRepository } from './client-file.repository';
import { CreateClientFileDto, AddClientFileDocumentDto } from './client-file.dto';
export declare class ClientFileService {
    private readonly repository;
    private readonly eventEmitter;
    constructor(repository: ClientFileRepository, eventEmitter: EventEmitter2);
    createClientFile(tenantId: string, dto: CreateClientFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        clientId: string;
    }>;
    getClientFiles(tenantId: string, clientId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        clientId: string;
    }[]>;
    addDocument(tenantId: string, clientFileId: string, dto: AddClientFileDocumentDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        url: string;
        clientFileId: string;
        documentType: string;
    }>;
}
