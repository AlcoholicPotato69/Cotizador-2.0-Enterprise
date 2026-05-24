export declare class SettingsService {
    private globalSettings;
    resolveEffectiveSettings(tenantId: string): Promise<{
        timezone: string;
        language: string;
        currency: string;
    }>;
    updateSettings(tenantId: string, updates: any): Promise<void>;
    rollbackSettings(tenantId: string, versionId: string): Promise<void>;
}
