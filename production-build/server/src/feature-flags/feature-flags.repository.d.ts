import { PrismaService } from '../prisma/prisma.service';
import { Prisma, FeatureFlag } from '@prisma/client';
export declare class FeatureFlagsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.FeatureFlagCreateInput): Promise<FeatureFlag>;
    findById(id: string): Promise<FeatureFlag | null>;
    findFirst(where: Prisma.FeatureFlagWhereInput): Promise<FeatureFlag | null>;
    findMany(where: Prisma.FeatureFlagWhereInput): Promise<FeatureFlag[]>;
    update(id: string, data: Prisma.FeatureFlagUpdateInput): Promise<FeatureFlag>;
}
