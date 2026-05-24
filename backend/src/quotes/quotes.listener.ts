import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QuotesService } from './quotes.service';
import { tenantContext } from '../prisma/tenant-context';
import { QuoteStatus } from '@prisma/client';

@Injectable()
export class QuotesListener {
  private readonly logger = new Logger(QuotesListener.name);

  constructor(private readonly quotesService: QuotesService) {}

  @OnEvent('contract.generated', { async: true })
  async handleContractGenerated(event: any) {
    if (!event || !event.tenantId || !event.payload) return;

    const { quoteId } = event.payload;

    tenantContext.run({ tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' }, async () => {
      try {
        await this.quotesService.updateStatus(quoteId, QuoteStatus.CONTRACT_GENERATED);
        this.logger.log(`Quote status updated to CONTRACT_GENERATED for quote: ${quoteId}`);
      } catch (error) {
        this.logger.error(`Failed to update quote status for quote: ${quoteId}`, error);
      }
    });
  }
}
