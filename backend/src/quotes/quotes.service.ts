import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotesRepository } from './quotes.repository';
import { QuoteStatus, Prisma } from '@prisma/client';
import { FsmValidator } from '../common/fsm.validator';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';

@Injectable()
export class QuotesService {
  constructor(
    private readonly repo: QuotesRepository,
    private readonly fsmValidator: FsmValidator,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async create(data: Omit<Prisma.QuoteUncheckedCreateInput, 'tenantId' | 'status'>) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) throw new NotFoundException('Tenant context missing');

    const quote = await this.repo.create({
      ...data,
      tenantId: ctx.tenantId,
      status: QuoteStatus.DRAFT,
      desglosePrecios: data.desglosePrecios || {},
    } as any); // Using UncheckedCreateInput structure directly with repository

    await this.eventPublisher.publish({
      eventName: 'quote.created',
      tenantId: ctx.tenantId,
      payload: { quoteId: quote.id },
      timestamp: new Date()
    });

    return quote;
  }

  async updateStatus(id: string, targetStatus: QuoteStatus) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) throw new NotFoundException('Tenant context missing');

    const quote = await this.repo.findById(ctx.tenantId, id);
    if (!quote) throw new NotFoundException('Quote not found');

    // FSM Validation
    this.fsmValidator.validateTransition('Quote', quote.status, targetStatus);

    const updated = await this.repo.update(ctx.tenantId, id, { status: targetStatus });

    await this.eventPublisher.publish({
      eventName: 'quote.status_updated',
      tenantId: ctx.tenantId,
      payload: { quoteId: quote.id, oldStatus: quote.status, newStatus: targetStatus },
      timestamp: new Date()
    });

    return updated;
  }
}
