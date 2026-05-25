import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CreateSpaceConfigurationDto,
  CreateSpaceRuleDto,
} from './dto/create-configuration.dto';
import {
  SpaceConfigurationUpdatedEvent,
  SpaceRuleCreatedEvent,
} from './events/space-configuration.events';
import { tenantContext } from '../../prisma/tenant-context';

@Injectable()
export class SpaceConfigurationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async setConfiguration(dto: CreateSpaceConfigurationDto) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx) => {
      const space = await tx.space.findFirst({
        where: { id: dto.spaceId, tenantId: ctx.tenantId },
      });
      if (!space)
        throw new ConflictException('Space not found or access denied');

      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;

      // Upsert configuration (assuming configKey is not strictly unique but used conceptually like it per space)
      // For basic engine, just create or update
      const config = await tx.spaceConfiguration.create({
        data: {
          tenantId: ctx.tenantId,
          spaceId: dto.spaceId,
          configKey: dto.configKey,
          configValue: dto.configValue,
        },
      });

      this.eventEmitter.emit(
        'space.configuration.updated',
        new SpaceConfigurationUpdatedEvent(
          ctx.tenantId,
          dto.spaceId,
          dto.configKey,
        ),
      );

      return config;
    });
  }

  async createRule(dto: CreateSpaceRuleDto) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx) => {
      const space = await tx.space.findFirst({
        where: { id: dto.spaceId, tenantId: ctx.tenantId },
      });
      if (!space)
        throw new ConflictException('Space not found or access denied');

      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;

      const rule = await tx.spaceRule.create({
        data: {
          tenantId: ctx.tenantId,
          spaceId: dto.spaceId,
          ruleType: dto.ruleType,
          ruleDetails: dto.ruleDetails,
        },
      });

      this.eventEmitter.emit(
        'space.rule.created',
        new SpaceRuleCreatedEvent(
          ctx.tenantId,
          dto.spaceId,
          rule.id,
          dto.ruleType,
        ),
      );

      return rule;
    });
  }
}
