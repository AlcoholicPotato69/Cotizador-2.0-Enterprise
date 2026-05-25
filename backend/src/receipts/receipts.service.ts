import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { ReceiptGeneratedEvent } from './events/receipts.events';
import { tenantContext } from '../prisma/tenant-context';
// Assumes receipt generation involves templates and documents

@Injectable()
export class ReceiptsService {
  private readonly logger = new Logger(ReceiptsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async generateReceiptForPayment(tenantId: string, paymentId: string) {
    const ctx = tenantContext.getStore();
    const effectiveTenantId = ctx?.tenantId || tenantId;
    if (!effectiveTenantId)
      throw new ConflictException('Tenant context required');

    this.logger.log(
      `Generating receipt for payment ${paymentId} (Tenant: ${effectiveTenantId})`,
    );

    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, tenantId: effectiveTenantId },
      include: { invoice: true },
    });

    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    const financialFile = await this.prisma.financialFile.create({
      data: {
        tenantId,
        invoiceId: payment.invoiceId,
        url: `https://storage.example.com/receipts/${paymentId}.pdf`,
      },
    });

    this.eventEmitter.emit(
      'receipt.generated',
      new ReceiptGeneratedEvent(tenantId, paymentId, financialFile.id),
    );

    return financialFile;
  }
}
