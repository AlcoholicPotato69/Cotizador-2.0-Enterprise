import { FeatureFlagsService } from './feature-flags.service';
export declare class FeatureFlagsController {
    private readonly service;
    constructor(service: FeatureFlagsService);
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
