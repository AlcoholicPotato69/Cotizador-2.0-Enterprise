import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, FinancialFile } from '@prisma/client';
export declare class FinancialFileRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createFinancialFile(data: Prisma.FinancialFileUncheckedCreateInput): Promise<FinancialFile>;
    findFinancialFiles(tenantId: string, invoiceId: string): Promise<FinancialFile[]>;
    findFinancialFileById(tenantId: string, id: string): Promise<FinancialFile | null>;
}
