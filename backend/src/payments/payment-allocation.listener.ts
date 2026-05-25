import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentAllocationsRepository } from './payment-allocations.repository';

@Injectable()
export class PaymentAllocationListener {
  private readonly logger = new Logger(PaymentAllocationListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly allocationsRepo: PaymentAllocationsRepository,
  ) {}

  @OnEvent('invoice.payment_allocated')
  async handlePaymentAllocated(event: { tenantId: string; payload: any }) {
    const { tenantId, payload } = event;
    const { paymentId, invoiceId, allocatedAmount } = payload;

    this.logger.log(
      `Registering payment allocation: ${allocatedAmount} for payment ${paymentId} on invoice ${invoiceId}`,
    );

    try {
      await this.prisma.$transaction(async (tx) => {
        await this.allocationsRepo.create(tx, {
          tenantId,
          paymentId,
          invoiceId,
          allocatedAmount,
        });
      });
    } catch (error) {
      this.logger.error(
        `Failed to register payment allocation for payment ${paymentId}`,
        error,
      );
    }
  }
}
