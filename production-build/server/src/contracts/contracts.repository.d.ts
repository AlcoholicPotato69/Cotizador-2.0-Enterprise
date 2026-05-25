import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Contract } from '@prisma/client';
export declare class ContractsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tx: Prisma.TransactionClient, data: Prisma.ContractUncheckedCreateInput): Promise<Contract>;
    findById(tenantId: string, id: string): Promise<Contract | null>;
    findByIdForUpdate(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Contract>;
    update(tx: Prisma.TransactionClient, tenantId: string, id: string, data: Prisma.ContractUpdateInput): Promise<Contract>;
}
