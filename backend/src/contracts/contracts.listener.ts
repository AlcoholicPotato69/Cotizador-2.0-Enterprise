import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ContractEngineService } from './contract.service';
import { tenantContext } from '../prisma/tenant-context';

export interface QuoteApprovedEvent {
  tenantId: string;
  payload: {
    quoteId: string;
    clientId: string;
    currencyCode?: string;
    [key: string]: unknown;
  };
}

@Injectable()
export class ContractsListener {
  private readonly logger = new Logger(ContractsListener.name);

  constructor(private readonly contractEngineService: ContractEngineService) {}

  @OnEvent('quote.status_updated', { async: true })
  async handleQuoteStatusUpdated(event: QuoteApprovedEvent) {
    if (!event || !event.tenantId || !event.payload) return;

    const { quoteId, clientId, currencyCode, newStatus } = event.payload;

    if (newStatus !== 'APPROVED') return;

    tenantContext.run(
      { tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' },
      async () => {
        try {
          await this.contractEngineService.createContract({
            clientId,
            quoteId,
            currencyCode: currencyCode || 'USD',
          });
          this.logger.log(`Contract generated for quote: ${quoteId}`);
        } catch (error) {
          this.logger.error(
            `Failed to generate contract for quote: ${quoteId}`,
            error,
          );
        }
      },
    );
  }
}
