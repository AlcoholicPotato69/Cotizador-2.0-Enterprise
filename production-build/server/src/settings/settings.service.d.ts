import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    private globalSettings;
    constructor(prisma: PrismaService);
    resolveEffectiveSettings(tenantId: string): Promise<{
        timezone: string;
        currency: string;
        language: string;
    }>;
    updateSettings(tenantId: string, updates: any): Promise<{
        id: string;
        tenantId: string;
        currency: string;
        timezone: string;
        language: string;
    }>;
    rollbackSettings(tenantId: string, versionId: string): Promise<{
        id: string;
        tenantId: string;
        currency: string;
        timezone: string;
        language: string;
    }>;
}
