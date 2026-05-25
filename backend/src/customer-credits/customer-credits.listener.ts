import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  CreditTransactionCreatedEvent,
  CreditBalanceUpdatedEvent,
} from './events/customer-credits.events';
import { CustomerCreditsService } from './customer-credits.service';

@Injectable()
export class CustomerCreditsListener {
  private readonly logger = new Logger(CustomerCreditsListener.name);

  constructor(
    private readonly customerCreditsService: CustomerCreditsService,
  ) {}

  @OnEvent('credit.transaction.created')
  handleTransactionCreated(event: CreditTransactionCreatedEvent) {
    this.logger.log(
      `Credit transaction created: ${event.transactionId} for client: ${event.clientId}`,
    );
    // Future logic: Trigger notifications or sync with ERP
  }

  @OnEvent('credit.balance.updated')
  handleBalanceUpdated(event: CreditBalanceUpdatedEvent) {
    this.logger.log(
      `Credit balance updated for client: ${event.clientId}. New balance: ${event.newBalance}`,
    );
    // Future logic: Auto-apply credit to pending invoices
  }

  @OnEvent('invoice.overpaid')
  async handleInvoiceOverpaid(event: any) {
    const { tenantId, payload } = event;
    const { invoiceId, clientId, overpaymentAmount } = payload;

    if (!clientId) {
      this.logger.warn(
        `Invoice overpaid but no clientId provided for invoice: ${invoiceId}`,
      );
      return;
    }

    try {
      this.logger.log(
        `Registering overpayment of ${overpaymentAmount} for client ${clientId} from invoice ${invoiceId}`,
      );
      await this.customerCreditsService.addTransaction(
        tenantId,
        {
          clientId,
          amount: overpaymentAmount,
          type: 'OVERPAYMENT',
          referenceId: invoiceId,
          notes: `Overpayment from invoice ${invoiceId}`,
        },
        'SYSTEM',
      );
    } catch (error) {
      this.logger.error(
        `Failed to register overpayment for invoice ${invoiceId}`,
        error,
      );
    }
  }
}
