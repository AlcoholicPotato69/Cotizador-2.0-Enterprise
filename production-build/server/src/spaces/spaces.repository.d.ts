import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Space } from '@prisma/client';
export declare class SpacesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(tenantId: string, id: string): Promise<Space | null>;
    findByIdForUpdate(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Space>;
    create(data: Prisma.SpaceUncheckedCreateInput): Promise<Space>;
    update(tenantId: string, id: string, data: Prisma.SpaceUpdateInput): Promise<Space>;
}
