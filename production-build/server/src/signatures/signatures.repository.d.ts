import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Signature } from '@prisma/client';
export declare class SignaturesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tx: Prisma.TransactionClient, data: Prisma.SignatureUncheckedCreateInput): Promise<Signature>;
    countByContract(tx: Prisma.TransactionClient, tenantId: string, contractId: string): Promise<number>;
}
