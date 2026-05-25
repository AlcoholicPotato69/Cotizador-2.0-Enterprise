import { PrismaService } from '../prisma/prisma.service';
export declare class FeatureFlagsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getFeatureFlag(key: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        featureKey: string;
        enabled: boolean;
        rolloutPercentage: number;
    } | null>;
}
