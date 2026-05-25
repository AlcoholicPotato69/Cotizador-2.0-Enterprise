import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, QuoteFile } from '@prisma/client';
export declare class QuoteFileRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createQuoteFile(data: Prisma.QuoteFileUncheckedCreateInput): Promise<QuoteFile>;
    findQuoteFiles(tenantId: string, quoteId: string): Promise<QuoteFile[]>;
    findQuoteFileById(tenantId: string, id: string): Promise<QuoteFile | null>;
}
