import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CreateRegulationDto,
  AcceptRegulationDto,
} from './dto/create-regulation.dto';
import {
  RegulationCreatedEvent,
  RegulationAcceptedEvent,
} from './events/regulation.events';
import { tenantContext } from '../prisma/tenant-context';

@Injectable()
export class RegulationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createRegulation(dto: CreateRegulationDto) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      const regulation = await tx.regulation.create({
        data: {
          tenantId: ctx.tenantId,
          title: dto.title,
        },
      });

      await tx.regulationVersion.create({
        data: {
          tenantId: ctx.tenantId,
          regulationId: regulation.id,
          version: dto.version || '1.0.0',
          content: dto.content,
        },
      });

      this.eventEmitter.emit(
        'regulation.created',
        new RegulationCreatedEvent(ctx.tenantId, regulation.id),
      );

      return regulation;
    });
  }

  async acceptRegulation(dto: AcceptRegulationDto) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx) => {
      const regulation = await tx.regulation.findFirst({
        where: { id: dto.regulationId, tenantId: ctx.tenantId },
      });
      if (!regulation)
        throw new ConflictException('Regulation not found or access denied');

      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;

      const acceptance = await tx.regulationAcceptance.create({
        data: {
          tenantId: ctx.tenantId,
          regulationId: dto.regulationId,
          acceptedBy: dto.acceptedBy,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
          version: dto.version,
        },
      });

      this.eventEmitter.emit(
        'regulation.accepted',
        new RegulationAcceptedEvent(
          ctx.tenantId,
          acceptance.id,
          dto.regulationId,
          dto.acceptedBy,
        ),
      );

      return acceptance;
    });
  }
}
