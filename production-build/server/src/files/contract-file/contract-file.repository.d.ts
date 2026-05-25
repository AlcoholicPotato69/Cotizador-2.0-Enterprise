import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ContractFile } from '@prisma/client';
export declare class ContractFileRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createContractFile(data: Prisma.ContractFileUncheckedCreateInput): Promise<ContractFile>;
    findContractFiles(tenantId: string, contractId: string): Promise<ContractFile[]>;
    findContractFileById(tenantId: string, id: string): Promise<ContractFile | null>;
}
