import { FeatureFlagsService } from './feature-flags.service';
import { TenantContextService } from '../common/tenant-context.service';
export declare class FeatureFlagsController {
    private readonly featureFlagsService;
    private readonly tenantContext;
    constructor(featureFlagsService: FeatureFlagsService, tenantContext: TenantContextService);
    create(body: {
        featureKey: string;
        enabled: boolean;
        rolloutPercentage: number;
    }): Promise<{
        id: string;
        tenantId: string;
        featureKey: string;
        enabled: boolean;
        rolloutPercentage: number;
    }>;
    isEnabled(featureKey: string): Promise<{
        enabled: boolean;
    }>;
    toggle(featureKey: string, enabled: boolean): Promise<{
        id: string;
        tenantId: string;
        featureKey: string;
        enabled: boolean;
        rolloutPercentage: number;
    }>;
}
