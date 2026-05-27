import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Client } from '@prisma/client';
export declare class ClientsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ClientCreateInput): Promise<Client>;
    findById(id: string, tenantId?: string): Promise<Client | null>;
    findFirst(where: Prisma.ClientWhereInput): Promise<Client | null>;
    findMany(where: Prisma.ClientWhereInput): Promise<Client[]>;
    update(id: string, tenantId: string, data: Prisma.ClientUpdateInput): Promise<Client>;
    softDelete(tenantId: string, id: string, deletedBy: string): Promise<Client>;
}
