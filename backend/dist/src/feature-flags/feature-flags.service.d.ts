import { PrismaService } from '../prisma/prisma.service';
export declare class FeatureFlagsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, featureKey: string, enabled?: boolean, rolloutPercentage?: number): Promise<{
        id: string;
        tenantId: string;
        featureKey: string;
        enabled: boolean;
        rolloutPercentage: number;
    }>;
    isEnabled(tenantId: string, featureKey: string): Promise<boolean>;
    toggleFlag(tenantId: string, featureKey: string, enabled: boolean): Promise<{
        id: string;
        tenantId: string;
        featureKey: string;
        enabled: boolean;
        rolloutPercentage: number;
    }>;
}
