import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Snapshot } from '@prisma/client';
export declare class SnapshotsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SnapshotCreateInput): Promise<Snapshot>;
    findLatestByType(entityType: string, tenantId: string): Promise<Snapshot | null>;
}
