import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(
    private readonly repo: ClientsRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async create(data: Omit<Prisma.ClientUncheckedCreateInput, 'tenantId'>) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');

    const client = await this.repo.create({
      ...data,
      tenant: { connect: { id: ctx.tenantId } },
    });

    await this.eventPublisher.publish({
      eventName: 'client.created',
      tenantId: ctx.tenantId,
      payload: { clientId: client.id },
      timestamp: new Date(),
    });

    return client;
  }

  async findById(id: string) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');
    return this.repo.findById(id, ctx.tenantId);
  }

  async update(id: string, data: Prisma.ClientUpdateInput) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');

    if ('tenantId' in data) delete data.tenantId;
    if ('tenant' in data) delete data.tenant;

    const updated = await this.repo.update(id, ctx.tenantId, data);

    await this.eventPublisher.publish({
      eventName: 'client.updated',
      tenantId: ctx.tenantId,
      payload: { clientId: updated.id },
      timestamp: new Date(),
    });

    return updated;
  }
}
