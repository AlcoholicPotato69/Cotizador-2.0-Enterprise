import { SpaceConfigurationService } from './space-configuration.service';
import { CreateSpaceConfigurationDto, CreateSpaceRuleDto } from './dto/create-configuration.dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        tenantId: string;
        role: string;
        email: string;
        permissions: string[];
    };
}
export declare class SpaceConfigurationController {
    private readonly service;
    constructor(service: SpaceConfigurationService);
    setConfiguration(req: AuthenticatedRequest, dto: CreateSpaceConfigurationDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        spaceId: string;
        configKey: string;
        configValue: import("@prisma/client/runtime/library").JsonValue;
    }>;
    createRule(req: AuthenticatedRequest, dto: CreateSpaceRuleDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        spaceId: string;
        ruleType: string;
        ruleDetails: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
export {};
