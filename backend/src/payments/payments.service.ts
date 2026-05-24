import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
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
  currencyCode: string; // added to remove cross-dependency
}

export interface RejectPaymentDto {
  paymentId: string;
  rejectionReason: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsRepo: PaymentsRepository,
    private readonly evidencesRepo: PaymentEvidencesRepository,
    private readonly eventPublisher: DomainEventPublisher,
    private readonly fsmValidator: FsmValidator
  ) {}

  async submitPayment(dto: SubmitPaymentDto): Promise<string> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create Payment in PENDING (optimistic, no cross-domain live read)
      const payment = await this.paymentsRepo.create(tx, {
        tenantId: ctx.tenantId,
        invoiceId: dto.invoiceId,
        currencyCode: dto.currencyCode,
        paymentAmount: dto.paymentAmount,
        status: PaymentStatus.PENDING,
        invoiceSnapshotId: dto.invoiceId,
      });
      
      this.fsmValidator.validateTransition('Payment', PaymentStatus.PENDING, PaymentStatus.UNDER_REVIEW);
      
      // 3. Save Evidence and Chain Hash
      const currentHash = crypto.createHash('sha256').update(dto.evidenceUrl + payment.id).digest('hex');
      
      const lastEvidence = await this.evidencesRepo.findLatest(tx, ctx.tenantId);
      const previousHash = lastEvidence ? lastEvidence.chainHash : 'GENESIS';
      const chainHash = crypto.createHash('sha256').update(previousHash + currentHash).digest('hex');
      
      await this.evidencesRepo.create(tx, {
        tenantId: ctx.tenantId,
        paymentId: payment.id,
        url: dto.evidenceUrl,
        documentHash: currentHash,
        previousDocumentHash: previousHash,
        chainHash: chainHash
      });
      
      // 4. Update Payment to UNDER_REVIEW
      await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, { status: PaymentStatus.UNDER_REVIEW });
      
      await this.eventPublisher.publish({
        eventName: 'PAYMENT_UNDER_REVIEW',
        tenantId: ctx.tenantId,
        payload: { paymentId: payment.id },
        timestamp: new Date()
      });
      
      return payment.id;
    });
  }

  async approvePayment(paymentId: string): Promise<void> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) throw new ConflictException('Tenant context required');

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Postgres setup
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      // 1. Fetch Payment and lock it
      const payment = await this.paymentsRepo.findByIdForUpdate(tx, ctx.tenantId, paymentId);
      if (!payment) throw new BadRequestException('Payment not found');

      this.fsmValidator.validateTransition('Payment', payment.status, PaymentStatus.APPROVED);

      // Approve Payment without cross-domain live read. Validation happens async in Invoice domain.
      await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, { status: PaymentStatus.APPROVED });

      await this.eventPublisher.publish({
        eventName: 'PAYMENT_APPROVED',
        tenantId: ctx.tenantId,
        payload: { paymentId: payment.id, invoiceId: payment.invoiceId, amount: payment.paymentAmount },
        timestamp: new Date()
      });
    });
  }

  async rejectPayment(dto: RejectPaymentDto): Promise<void> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) throw new ConflictException('Tenant context required');

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const payment = await this.paymentsRepo.findByIdForUpdate(tx, ctx.tenantId, dto.paymentId);
      if (!payment) throw new BadRequestException('Payment not found');

      this.fsmValidator.validateTransition('Payment', payment.status, PaymentStatus.REJECTED);

      await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, { 
        status: PaymentStatus.REJECTED,
        rejectionReason: dto.rejectionReason
      });

      await this.eventPublisher.publish({
        eventName: 'PAYMENT_REJECTED',
        tenantId: ctx.tenantId,
        payload: { paymentId: payment.id, reason: dto.rejectionReason },
        timestamp: new Date()
      });
    });
  }
}

