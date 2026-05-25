import { Injectable, NotFoundException } from '@nestjs/common';
import { SpacesRepository } from './spaces.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';
import { Prisma } from '@prisma/client';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(
    private readonly repo: SpacesRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async create(data: CreateSpaceDto) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');

    const typeLower = data.spaceType.toLowerCase();
    const pmAllowed = [
      'publicidad física',
      'publicidad digital',
      'publicidad fisica',
    ];
    const cpAllowed = [
      'salones',
      'espacios',
      'publicidad física',
      'publicidad digital',
      'publicidad fisica',
    ];

    if (ctx.tenantId === 'pm' && !pmAllowed.includes(typeLower)) {
      throw new Error(
        'Plaza Mayor solo puede crear espacios de tipo Publicidad Física o Digital.',
      );
    }
    if (ctx.tenantId === 'cp' && !cpAllowed.includes(typeLower)) {
      throw new Error(
        'Casa de Piedra solo puede crear Salones, Espacios o Publicidad.',
      );
    }

    if (!data.planoPdf) {
      throw new Error('Todo espacio requiere un plano_pdf.');
    }
    if (!data.regulationTemplate) {
      throw new Error('Todo espacio requiere un reglamento.');
    }

    const space = await this.repo.create({
      ...data,
      tenantId: ctx.tenantId,
      configB2b: data.configB2b ?? {},
      preciosPorDia: data.preciosPorDia ?? {},
      diasBloqueados: data.diasBloqueados ?? {},
    });

    await this.eventPublisher.publish({
      eventName: 'space.created',
      tenantId: ctx.tenantId,
      payload: { spaceId: space.id },
      timestamp: new Date(),
    });

    return space;
  }

  async findById(id: string) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');
    return this.repo.findById(ctx.tenantId, id);
  }

  async findAll() {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');
    return this.repo.findAll(ctx.tenantId);
  }

  async update(id: string, data: UpdateSpaceDto) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');

    if (data.spaceType) {
      const typeLower = data.spaceType.toLowerCase();
      const pmAllowed = [
        'publicidad física',
        'publicidad digital',
        'publicidad fisica',
      ];
      const cpAllowed = [
        'salones',
        'espacios',
        'publicidad física',
        'publicidad digital',
        'publicidad fisica',
      ];

      if (ctx.tenantId === 'pm' && !pmAllowed.includes(typeLower)) {
        throw new Error(
          'Plaza Mayor solo puede crear espacios de tipo Publicidad Física o Digital.',
        );
      }
      if (ctx.tenantId === 'cp' && !cpAllowed.includes(typeLower)) {
        throw new Error(
          'Casa de Piedra solo puede crear Salones, Espacios o Publicidad.',
        );
      }
    }

    if (data.planoPdf !== undefined && !data.planoPdf) {
      throw new Error('Todo espacio requiere un plano_pdf.');
    }
    if (data.regulationTemplate !== undefined && !data.regulationTemplate) {
      throw new Error('Todo espacio requiere un reglamento.');
    }

    const updated = await this.repo.update(ctx.tenantId, id, data);

    await this.eventPublisher.publish({
      eventName: 'space.updated',
      tenantId: ctx.tenantId,
      payload: { spaceId: updated.id },
      timestamp: new Date(),
    });

    return updated;
  }
}
