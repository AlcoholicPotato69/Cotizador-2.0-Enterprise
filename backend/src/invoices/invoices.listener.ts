import { Injectable, BadRequestException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InvoicesRepository } from './invoices.repository';
import { PrismaService } from '../prisma/prisma.service';
import { FsmValidator } from '../common/fsm.validator';
import { InvoiceStatus, Prisma } from '@prisma/client';

@Injectable()
export class InvoicesListener {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoicesRepo: InvoicesRepository,
    private readonly fsmValidator: FsmValidator
  ) {}

  @OnEvent('PAYMENT_APPROVED')
  async handlePaymentApproved(event: any) {
    const { tenantId, payload } = event;
    const { invoiceId, amount } = payload;
    
    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.$executeRaw`
        SELECT set_config('app.current_tenant_id', ${tenantId}, TRUE)
      `;
      
      const invoice = await this.invoicesRepo.findByIdForUpdate(tx, tenantId, invoiceId);
      if (!invoice) throw new BadRequestException('Invoice not found for payment');

      // Domain logic inside its own domain!
      const paymentAmount = new Prisma.Decimal(amount);
      const newAmountPaid = invoice.amountPaid.add(paymentAmount);
      const newBalanceDue = invoice.totalAmount.sub(newAmountPaid);

      let newStatus: InvoiceStatus = invoice.status;
      if (newBalanceDue.lte(0)) {
        newStatus = InvoiceStatus.PAID;
      } else if (newAmountPaid.gt(0)) {
        newStatus = InvoiceStatus.PARTIALLY_PAID;
      }

      if (newStatus !== invoice.status) {
        this.fsmValidator.validateTransition('Invoice', invoice.status, newStatus);
      }

      await this.invoicesRepo.update(tx, tenantId, invoice.id, {
        amountPaid: newAmountPaid,
        balanceDue: newBalanceDue,
        status: newStatus,
        paymentStatus: newStatus === InvoiceStatus.PAID ? 'PAID' : 'PARTIAL'
      });
    });
  }
}

