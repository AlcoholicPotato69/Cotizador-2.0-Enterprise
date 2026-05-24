import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ContractEngineService } from './contract.service';
import { tenantContext } from '../prisma/tenant-context';

@Injectable()
export class ContractsListener {
  private readonly logger = new Logger(ContractsListener.name);

  constructor(private readonly contractEngineService: ContractEngineService) {}

  @OnEvent('quote.approved', { async: true })
  async handleQuoteApproved(event: any) {
    if (!event || !event.tenantId || !event.payload) return;

    const { quoteId, currencyCode } = event.payload;

    tenantContext.run({ tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' }, async () => {
      try {
        await this.contractEngineService.createContract({ quoteId, currencyCode: currencyCode || 'USD' });
        this.logger.log(`Contract generated for quote: ${quoteId}`);
      } catch (error) {
        this.logger.error(`Failed to generate contract for quote: ${quoteId}`, error);
      }
    });
  }
}
