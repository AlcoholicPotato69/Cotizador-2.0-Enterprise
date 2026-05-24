import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoicesRepository } from './invoices.repository';

import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { FsmValidator } from '../common/fsm.validator';
import { InvoiceStatus, ContractStatus } from '@prisma/client';
import { tenantContext } from '../prisma/tenant-context';
import { Prisma } from '@prisma/client';

export interface GenerateInvoiceDto {
  contractId: string;
  totalAmount: Prisma.Decimal;
}

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoicesRepo: InvoicesRepository,
    private readonly eventPublisher: DomainEventPublisher,
    private readonly fsmValidator: FsmValidator
  ) {}

  async generateInvoice(dto: GenerateInvoiceDto & { currencyCode: string }): Promise<string> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Set Postgres variables for RLS / Audit if any
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      // Create invoice
      const invoice = await this.invoicesRepo.create(tx, {
        tenantId: ctx.tenantId,
        contractSnapshotId: dto.contractId, // using contract id as snapshot ref
        currencyCode: dto.currencyCode,
        totalAmount: dto.totalAmount,
        amountPaid: new Prisma.Decimal(0),
        balanceDue: dto.totalAmount,
        paymentStatus: 'UNPAID',
        status: InvoiceStatus.DRAFT,
      });

      // 3. Emit domain event
      await this.eventPublisher.publish({
        eventName: 'invoice.generated',
        tenantId: ctx.tenantId,
        payload: { invoiceId: invoice.id, contractId: dto.contractId, totalAmount: dto.totalAmount },
        timestamp: new Date()
      });

      return invoice.id;
    });
  }
}

