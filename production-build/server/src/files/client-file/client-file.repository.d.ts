import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ClientFile, ClientFileDocument } from '@prisma/client';
export declare class ClientFileRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createClientFile(data: Prisma.ClientFileUncheckedCreateInput): Promise<ClientFile>;
    findClientFiles(tenantId: string, clientId: string): Promise<ClientFile[]>;
    findClientFileById(tenantId: string, id: string): Promise<ClientFile | null>;
    addDocument(data: Prisma.ClientFileDocumentUncheckedCreateInput): Promise<ClientFileDocument>;
    findClientFileDocumentById(tenantId: string, id: string): Promise<ClientFileDocument | null>;
}
