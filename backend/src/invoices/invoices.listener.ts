import { Injectable, BadRequestException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InvoicesRepository } from './invoices.repository';
import { PrismaService } from '../prisma/prisma.service';
import { FsmValidator } from '../common/fsm.validator';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';

export interface PaymentApprovedEvent {
  tenantId: string;
  payload: {
    invoiceId: string;
    amount: string | number;
    paymentId: string;
    [key: string]: unknown;
  };
}

@Injectable()
export class InvoicesListener {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoicesRepo: InvoicesRepository,
    private readonly fsmValidator: FsmValidator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  @OnEvent('payment.approved')
  async handlePaymentApproved(event: PaymentApprovedEvent) {
    const { tenantId, payload } = event;
    const { invoiceId, amount, paymentId } = payload;

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.$executeRaw`
        SELECT set_config('app.current_tenant_id', ${tenantId}, TRUE)
      `;

      const invoice = await this.invoicesRepo.findByIdForUpdate(
        tx,
        tenantId,
        invoiceId,
      );
      if (!invoice)
        throw new BadRequestException('Invoice not found for payment');

      const paymentAmount = new Prisma.Decimal(amount);
      const newAmountPaid = invoice.amountPaid.add(paymentAmount);
      const newBalanceDue = invoice.totalAmount.sub(newAmountPaid);

      let newStatus: InvoiceStatus = invoice.status;
      if (newBalanceDue.lte(0)) {
        newStatus = InvoiceStatus.PAID;
      } else if (newAmountPaid.gt(0)) {
        newStatus = InvoiceStatus.PARTIALLY_PAID;
      }

      const allocatedAmount = newBalanceDue.lt(0)
        ? paymentAmount.sub(newBalanceDue.abs())
        : paymentAmount;

      if (newStatus !== invoice.status) {
        this.fsmValidator.validateTransition(
          'Invoice',
          invoice.status,
          newStatus,
        );
      }

      await this.invoicesRepo.update(tx, tenantId, invoice.id, {
        amountPaid: newAmountPaid,
        balanceDue: newBalanceDue.lt(0) ? new Prisma.Decimal(0) : newBalanceDue,
        status: newStatus,
        paymentStatus: newStatus === InvoiceStatus.PAID ? 'PAID' : 'PARTIAL',
      });

      await (tx as any).outboxEvent.create({
        data: {
          tenantId,
          aggregateType: 'Invoice',
          aggregateId: invoice.id,
          eventType: 'invoice.payment_allocated',
          payload: {
            paymentId,
            invoiceId: invoice.id,
            allocatedAmount: allocatedAmount.toNumber(),
          },
          status: 'PENDING',
        },
      });

      // Issue events for Receipt and Customer Credit Engines
      if (newStatus === InvoiceStatus.PAID) {
        await (tx as any).outboxEvent.create({
          data: {
            tenantId,
            aggregateType: 'Invoice',
            aggregateId: invoice.id,
            eventType: 'invoice.paid',
            payload: {
              invoiceId: invoice.id,
              contractId: invoice.contractSnapshotId,
              paymentId,
            },
            status: 'PENDING',
          },
        });
      }

      if (newBalanceDue.lt(0)) {
        // Overpayment detected
        await (tx as any).outboxEvent.create({
          data: {
            tenantId,
            aggregateType: 'Invoice',
            aggregateId: invoice.id,
            eventType: 'invoice.overpaid',
            payload: {
              invoiceId: invoice.id,
              clientId: (invoice as any).clientSnapshotId || 'unknown',
              overpaymentAmount: Math.abs(newBalanceDue.toNumber()),
            },
            status: 'PENDING',
          },
        });
      }
    });
  }

  @OnEvent('payment.refunded')
  async handlePaymentRefunded(event: PaymentApprovedEvent) {
    const { tenantId, payload } = event;
    const { invoiceId, amount, paymentId } = payload;

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.$executeRaw`
        SELECT set_config('app.current_tenant_id', ${tenantId}, TRUE)
      `;

      const invoice = await this.invoicesRepo.findByIdForUpdate(
        tx,
        tenantId,
        invoiceId,
      );
      if (!invoice)
        throw new BadRequestException('Invoice not found for refund');

      const refundAmount = new Prisma.Decimal(amount);
      const newAmountPaid = invoice.amountPaid.sub(refundAmount).lt(0)
        ? new Prisma.Decimal(0)
        : invoice.amountPaid.sub(refundAmount);
      const newBalanceDue = invoice.totalAmount.sub(newAmountPaid);

      let newStatus: InvoiceStatus = invoice.status;
      if (newAmountPaid.lte(0)) {
        newStatus = InvoiceStatus.STAMPED; // or some other status, assuming it goes back to STAMPED/SENT
      } else if (newBalanceDue.gt(0)) {
        newStatus = InvoiceStatus.PARTIALLY_PAID;
      }

      await this.invoicesRepo.update(tx, tenantId, invoice.id, {
        amountPaid: newAmountPaid,
        balanceDue: newBalanceDue,
        status: newStatus,
        paymentStatus:
          newStatus === InvoiceStatus.STAMPED ? 'UNPAID' : 'PARTIAL',
      });
    });
  }
}
