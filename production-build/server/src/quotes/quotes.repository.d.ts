import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Quote } from '@prisma/client';
export declare class QuotesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.QuoteUncheckedCreateInput, tx?: Prisma.TransactionClient): Promise<Quote>;
    findByIdForUpdate(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Quote>;
    findById(tenantId: string, id: string, tx?: Prisma.TransactionClient): Promise<Quote | null>;
    findFirst(where: Prisma.QuoteWhereInput): Promise<Quote | null>;
    findMany(where: Prisma.QuoteWhereInput): Promise<Quote[]>;
    update(tenantId: string, id: string, data: Prisma.QuoteUpdateInput, tx?: Prisma.TransactionClient): Promise<Quote>;
}
