import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateSpaceConfigurationDto, CreateSpaceRuleDto } from './dto/create-configuration.dto';
export declare class SpaceConfigurationService {
    private readonly prisma;
    private readonly eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    setConfiguration(dto: CreateSpaceConfigurationDto): Promise<{
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
    createRule(dto: CreateSpaceRuleDto): Promise<{
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
