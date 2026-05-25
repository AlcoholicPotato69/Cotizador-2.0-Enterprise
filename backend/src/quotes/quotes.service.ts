import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotesRepository } from './quotes.repository';
import { QuoteStatus, Prisma } from '@prisma/client';
import { FsmValidator } from '../common/fsm.validator';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';

/**
 * Service managing Quote business logic.
 * Handles creation, status transitions, FSM validation, and domain event publishing.
 * Works exclusively within a tenant context.
 *
 * @class QuotesService
 */
@Injectable()
export class QuotesService {
  constructor(
    private readonly repo: QuotesRepository,
    private readonly fsmValidator: FsmValidator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  /**
   * Creates a new quote in DRAFT status and publishes a 'quote.created' domain event.
   * Executed within a database transaction.
   *
   * @param {Omit<Prisma.QuoteUncheckedCreateInput, 'tenantId' | 'status'>} data - The quote creation data.
   * @returns {Promise<any>} The persisted quote record.
   * @throws {NotFoundException} If the tenant context is missing.
   */
  async create(
    data: Omit<Prisma.QuoteUncheckedCreateInput, 'tenantId' | 'status'>,
  ) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');

    return await this.repo['prisma'].$transaction(async (tx) => {
      const quote = await this.repo.create(
        {
          ...data,
          tenantId: ctx.tenantId,
          status: QuoteStatus.DRAFT,
          desglosePrecios: data.desglosePrecios
            ? data.desglosePrecios
            : Prisma.JsonNull,
        },
        tx,
      );

      await this.eventPublisher.publish({
        eventName: 'quote.created',
        tenantId: ctx.tenantId,
        payload: { quoteId: quote.id },
        timestamp: new Date(),
      });

      return quote;
    });
  }

  /**
   * Transitions a quote to a new status.
   * Enforces FSM rules and publishes a 'quote.status_updated' domain event.
   * Executed within a database transaction using row-level locking.
   *
   * @param {string} id - The unique identifier of the quote.
   * @param {QuoteStatus} targetStatus - The status to transition the quote into.
   * @returns {Promise<any>} The updated quote record.
   * @throws {NotFoundException} If the tenant context is missing or the quote is not found.
   * @throws {Error} If the FSM transition is invalid.
   */
  async updateStatus(id: string, targetStatus: QuoteStatus) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');

    return await this.repo['prisma'].$transaction(async (tx) => {
      // Usar findByIdForUpdate en lugar de findById para bloquear la fila durante la transacción
      const quote = await this.repo.findByIdForUpdate(tx, ctx.tenantId, id);
      if (!quote) throw new NotFoundException('Quote not found');

      // FSM Validation
      this.fsmValidator.validateTransition('Quote', quote.status, targetStatus);

      const updated = await this.repo.update(
        ctx.tenantId,
        id,
        { status: targetStatus },
        tx,
      );

      await this.eventPublisher.publish({
        eventName: 'quote.status_updated',
        tenantId: ctx.tenantId,
        payload: {
          quoteId: quote.id,
          clientId: quote.clientId,
          currencyCode: quote.currencyCode,
          oldStatus: quote.status,
          newStatus: targetStatus,
        },
        timestamp: new Date(),
      });

      return updated;
    });
  }
}
