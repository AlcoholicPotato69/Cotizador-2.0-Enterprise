import { PrismaService } from '../prisma/prisma.service';
import { Prisma, SpaceOccupancy } from '@prisma/client';
export declare class OccupancyRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tx: Prisma.TransactionClient, data: Prisma.SpaceOccupancyUncheckedCreateInput): Promise<SpaceOccupancy>;
    findOverlapping(tx: Prisma.TransactionClient, tenantId: string, spaceId: string, startTime: Date, endTime: Date): Promise<SpaceOccupancy | null>;
}
