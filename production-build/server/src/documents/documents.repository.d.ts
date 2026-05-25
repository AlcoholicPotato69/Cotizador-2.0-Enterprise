import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Document } from '@prisma/client';
export declare class DocumentsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tx: Prisma.TransactionClient, data: Prisma.DocumentUncheckedCreateInput): Promise<Document>;
    findLatest(tx: Prisma.TransactionClient, tenantId: string): Promise<Document | null>;
}
