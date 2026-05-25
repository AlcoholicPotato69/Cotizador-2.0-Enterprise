import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsRepository } from './payments.repository';

import { PaymentEvidencesRepository } from './payment-evidences.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { PaymentStatus, InvoiceStatus, Prisma } from '@prisma/client';
import { tenantContext } from '../prisma/tenant-context';
import { FsmValidator } from '../common/fsm.validator';
import * as crypto from 'crypto';

export interface SubmitPaymentDto {
  invoiceId: string;
  paymentAmount: Prisma.Decimal;
  evidenceUrl: string;
  currencyCode: string;
}

export interface RejectPaymentDto {
  paymentId: string;
  rejectionReason: string;
}

export interface RefundPaymentDto {
  paymentId: string;
  refundReason: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsRepo: PaymentsRepository,
    private readonly evidencesRepo: PaymentEvidencesRepository,
    private readonly eventPublisher: DomainEventPublisher,
    private readonly fsmValidator: FsmValidator,
  ) {}

  async submitPayment(dto: SubmitPaymentDto): Promise<string> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const paymentAmountDecimal = new Prisma.Decimal(dto.paymentAmount);
        const payment = await this.paymentsRepo.create(tx, {
          tenantId: ctx.tenantId,
          invoiceId: dto.invoiceId,
          currencyCode: dto.currencyCode,
          paymentAmount: paymentAmountDecimal,
          status: PaymentStatus.PENDING,
          invoiceSnapshotId: dto.invoiceId,
          folio: `PAY-${Date.now()}`,
        });

        this.fsmValidator.validateTransition(
          'Payment',
          PaymentStatus.PENDING,
          PaymentStatus.UNDER_REVIEW,
        );

        const currentHash = crypto
          .createHash('sha256')
          .update(dto.evidenceUrl + payment.id)
          .digest('hex');

        const lastEvidence = await this.evidencesRepo.findLatest(
          tx,
          ctx.tenantId,
        );
        const previousHash = lastEvidence ? lastEvidence.chainHash : 'GENESIS';
        const chainHash = crypto
          .createHash('sha256')
          .update(previousHash + currentHash)
          .digest('hex');

        await this.evidencesRepo.create(tx, {
          tenantId: ctx.tenantId,
          paymentId: payment.id,
          url: dto.evidenceUrl,
          documentHash: currentHash,
          previousDocumentHash: previousHash,
          chainHash: chainHash,
        });

        await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, {
          status: PaymentStatus.UNDER_REVIEW,
        });

        await (tx as any).outboxEvent.create({
          data: {
            tenantId: ctx.tenantId,
            aggregateType: 'Payment',
            aggregateId: payment.id,
            eventType: 'payment.created',
            payload: { paymentId: payment.id },
            status: 'PENDING',
          },
        });

        return payment.id;
      },
    );
  }

  async approvePayment(paymentId: string): Promise<void> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      const payment = await this.paymentsRepo.findByIdForUpdate(
        tx,
        ctx.tenantId,
        paymentId,
      );
      if (!payment) throw new BadRequestException('Payment not found');

      this.fsmValidator.validateTransition(
        'Payment',
        payment.status,
        PaymentStatus.APPROVED,
      );

      await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, {
        status: PaymentStatus.APPROVED,
      });

      await (tx as any).outboxEvent.create({
        data: {
          tenantId: ctx.tenantId,
          aggregateType: 'Payment',
          aggregateId: payment.id,
          eventType: 'payment.approved',
          payload: {
            paymentId: payment.id,
            invoiceId: payment.invoiceId,
            amount: payment.paymentAmount.toNumber(),
          },
          status: 'PENDING',
        },
      });
    });
  }

  async rejectPayment(dto: RejectPaymentDto): Promise<void> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const payment = await this.paymentsRepo.findByIdForUpdate(
        tx,
        ctx.tenantId,
        dto.paymentId,
      );
      if (!payment) throw new BadRequestException('Payment not found');

      this.fsmValidator.validateTransition(
        'Payment',
        payment.status,
        PaymentStatus.REJECTED,
      );

      await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, {
        status: PaymentStatus.REJECTED,
        rejectionReason: dto.rejectionReason,
      });

      await (tx as any).outboxEvent.create({
        data: {
          tenantId: ctx.tenantId,
          aggregateType: 'Payment',
          aggregateId: payment.id,
          eventType: 'payment.rejected',
          payload: { paymentId: payment.id, reason: dto.rejectionReason },
          status: 'PENDING',
        },
      });
    });
  }

  async refundPayment(dto: RefundPaymentDto): Promise<void> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const payment = await this.paymentsRepo.findByIdForUpdate(
        tx,
        ctx.tenantId,
        dto.paymentId,
      );
      if (!payment) throw new BadRequestException('Payment not found');

      this.fsmValidator.validateTransition(
        'Payment',
        payment.status,
        PaymentStatus.REFUNDED,
      );

      await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, {
        status: PaymentStatus.REFUNDED,
      });

      await (tx as any).outboxEvent.create({
        data: {
          tenantId: ctx.tenantId,
          aggregateType: 'Payment',
          aggregateId: payment.id,
          eventType: 'payment.refunded',
          payload: {
            paymentId: payment.id,
            invoiceId: payment.invoiceId,
            amount: payment.paymentAmount.toNumber(),
            reason: dto.refundReason,
          },
          status: 'PENDING',
        },
      });
    });
  }
}
