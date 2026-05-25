import {
  Injectable,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoicesRepository } from './invoices.repository';
import { ConfigService } from '@nestjs/config';

import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { FsmValidator } from '../common/fsm.validator';
import { InvoiceStatus } from '@prisma/client';
import { tenantContext } from '../prisma/tenant-context';
import { Prisma } from '@prisma/client';
import { InvoiceMode } from '../config/env.validation';

export interface GenerateInvoiceDto {
  clientId: string;
  contractId: string;
  totalAmount: Prisma.Decimal;
}

export interface StampResult {
  success: boolean;
  requiresManualUpload: boolean;
  message: string;
}

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly invoicesRepo: InvoicesRepository,
    private readonly eventPublisher: DomainEventPublisher,
    private readonly fsmValidator: FsmValidator,
  ) {}

  async generateInvoice(
    dto: GenerateInvoiceDto & { currencyCode: string },
  ): Promise<string> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Set Postgres variables for RLS / Audit if any
        await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

        // Create invoice
        const totalAmountDecimal = new Prisma.Decimal(dto.totalAmount);
        const invoice = await this.invoicesRepo.create(tx, {
          tenantId: ctx.tenantId,
          clientId: dto.clientId,
          contractSnapshotId: dto.contractId, // using contract id as snapshot ref
          currencyCode: dto.currencyCode,
          totalAmount: totalAmountDecimal,
          amountPaid: new Prisma.Decimal(0),
          balanceDue: totalAmountDecimal,
          paymentStatus: 'UNPAID',
          status: InvoiceStatus.DRAFT,
          folio: `INV-${Date.now()}`,
        });

        // 3. Insert domain event into Outbox
        await (tx as any).outboxEvent.create({
          data: {
            tenantId: ctx.tenantId,
            aggregateType: 'Invoice',
            aggregateId: invoice.id,
            eventType: 'invoice.generated',
            payload: {
              invoiceId: invoice.id,
              contractId: dto.contractId,
              totalAmount: totalAmountDecimal.toNumber(),
            },
            status: 'PENDING',
          },
        });

        return invoice.id;
      },
    );
  }

  async stampInvoice(invoiceId: string): Promise<StampResult> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, tenantId: ctx.tenantId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    const mode =
      this.configService.get<InvoiceMode>('INVOICE_MODE') ||
      InvoiceMode.INTERNAL;

    if (mode === InvoiceMode.INTELISIS) {
      try {
        await this.stampWithIntelisis(invoiceId, ctx.tenantId);
        return {
          success: true,
          requiresManualUpload: false,
          message: 'Stamped via Intelisis',
        };
      } catch (error) {
        this.logger.warn(
          `Intelisis stamping failed for invoice ${invoiceId}. Fallback to manual upload enabled.`,
        );
        return {
          success: false,
          requiresManualUpload: true,
          message: 'External provider failed. Please upload XML/PDF manually.',
        };
      }
    } else {
      // INTERNAL mode means we just generate internally or allow manual upload
      return {
        success: false,
        requiresManualUpload: true,
        message: 'Internal mode active. Please upload XML/PDF manually.',
      };
    }
  }

  async uploadManualInvoiceFiles(
    invoiceId: string,
    xmlUrl: string,
    pdfUrl: string,
  ) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findFirst({
        where: { id: invoiceId, tenantId: ctx.tenantId },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');

      // Assume we have an 'xmlUrl' and 'pdfUrl' column or we just store them in a related table.
      // For now we update the status to STAMPED.
      // In a real scenario, we might have metadata or specific columns for these files.

      await tx.invoice.updateMany({
        where: { id: invoiceId, tenantId: ctx.tenantId },
        data: {
          status: InvoiceStatus.STAMPED,
          // metadata: { xmlUrl, pdfUrl } // if metadata existed
        },
      });
      const updated = await tx.invoice.findFirst({
        where: { id: invoiceId, tenantId: ctx.tenantId },
      });

      await (tx as any).outboxEvent.create({
        data: {
          tenantId: ctx.tenantId,
          aggregateType: 'Invoice',
          aggregateId: invoice.id,
          eventType: 'invoice.stamped',
          payload: { invoiceId, xmlUrl, pdfUrl },
          status: 'PENDING',
        },
      });

      return updated;
    });
  }

  private async stampWithIntelisis(
    invoiceId: string,
    tenantId: string,
  ): Promise<void> {
    const intelisisUrl = this.configService.get<string>('INTELISIS_API_URL');
    if (!intelisisUrl) {
      throw new Error('Intelisis API URL not configured');
    }

    try {
      const response = await fetch(`${intelisisUrl}/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, tenantId }),
      });

      if (!response.ok) {
        throw new Error(`Intelisis API failed with status ${response.status}`);
      }

      await this.prisma.invoice.updateMany({
        where: { id: invoiceId, tenantId },
        data: { status: InvoiceStatus.STAMPED },
      });
    } catch (error) {
      this.logger.error(
        `Failed to stamp invoice ${invoiceId} with Intelisis:`,
        error,
      );
      throw error;
    }
  }

  async getInvoiceReport() {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return this.prisma.invoice.findMany({
      where: { tenantId: ctx.tenantId },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        amountPaid: true,
        balanceDue: true,
        currencyCode: true,
        createdAt: true,
      },
    });
  }
}
