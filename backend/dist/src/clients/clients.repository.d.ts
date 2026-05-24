import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Client } from '@prisma/client';
export declare class ClientsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ClientCreateInput): Promise<Client>;
    findById(id: string): Promise<Client | null>;
    findFirst(where: Prisma.ClientWhereInput): Promise<Client | null>;
    update(id: string, data: Prisma.ClientUpdateInput): Promise<Client>;
    softDelete(id: string, deletedBy: string): Promise<Client>;
}
