import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReceiptsService } from './receipts.service';

@Injectable()
export class ReceiptsListener {
  private readonly logger = new Logger(ReceiptsListener.name);

  constructor(private readonly receiptsService: ReceiptsService) {}

  @OnEvent('PAYMENT_APPROVED')
  async handlePaymentApproved(event: any) {
    const { tenantId, payload } = event;
    const { paymentId } = payload;
    this.logger.log(`Payment approved: ${paymentId}. Generating receipt...`);
    try {
      await this.receiptsService.generateReceiptForPayment(tenantId, paymentId);
    } catch (error: any) {
      this.logger.error(
        `Error generating receipt for payment ${paymentId}`,
        error.stack,
      );
    }
  }
}
