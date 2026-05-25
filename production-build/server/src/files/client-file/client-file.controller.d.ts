import { ClientFileService } from './client-file.service';
import { CreateClientFileDto, AddClientFileDocumentDto } from './client-file.dto';
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
export declare class ClientFileController {
    private readonly service;
    constructor(service: ClientFileService);
    createClientFile(req: AuthenticatedRequest, dto: CreateClientFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        clientId: string;
    }>;
    getClientFiles(req: AuthenticatedRequest, clientId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        clientId: string;
    }[]>;
    addDocument(req: AuthenticatedRequest, id: string, dto: AddClientFileDocumentDto): Promise<{
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
export {};
