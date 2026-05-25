import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateTemplateDto, CreateClauseDto } from './dto/create-template.dto';
import {
  TemplateCreatedEvent,
  ClauseCreatedEvent,
} from './events/template.events';
import { tenantContext } from '../prisma/tenant-context';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createTemplate(dto: CreateTemplateDto) {
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

      const template = await tx.contractTemplate.create({
        data: {
          tenantId: ctx.tenantId,
          name: dto.name,
        },
      });

      await tx.contractTemplateVersion.create({
        data: {
          tenantId: ctx.tenantId,
          contractTemplateId: template.id,
          version: dto.version || '1.0.0',
          content: dto.content,
        },
      });

      this.eventEmitter.emit(
        'template.created',
        new TemplateCreatedEvent(ctx.tenantId, template.id),
      );

      return template;
    });
  }

  async createClause(dto: CreateClauseDto) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx) => {
      if (dto.templateId) {
        const template = await tx.contractTemplate.findFirst({
          where: { id: dto.templateId, tenantId: ctx.tenantId },
        });
        if (!template)
          throw new ConflictException('Template not found or access denied');
      }

      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;

      const clause = await tx.contractClause.create({
        data: {
          tenantId: ctx.tenantId,
          title: dto.title,
        },
      });

      await tx.clauseVersion.create({
        data: {
          tenantId: ctx.tenantId,
          contractClauseId: clause.id,
          version: '1.0.0',
          content: dto.content,
        },
      });

      this.eventEmitter.emit(
        'clause.created',
        new ClauseCreatedEvent(ctx.tenantId, clause.id, dto.templateId),
      );

      return clause;
    });
  }
}
