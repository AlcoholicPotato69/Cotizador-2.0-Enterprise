import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Invoice } from '@prisma/client';

@Injectable()
export class InvoicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tx: Prisma.TransactionClient,
    data: Prisma.InvoiceUncheckedCreateInput,
  ): Promise<Invoice> {
    return tx.invoice.create({ data });
  }

  async findByIdForUpdate(
    tx: Prisma.TransactionClient,
    tenantId: string,
    id: string,
  ): Promise<Invoice> {
    const result = await tx.$queryRaw<Invoice[]>`
      SELECT 
        id, 
        tenant_id AS "tenantId", 
        contract_snapshot_id AS "contractSnapshotId", 
        currency_code AS "currencyCode", 
        total_amount AS "totalAmount", 
        amount_paid AS "amountPaid", 
        balance_due AS "balanceDue", 
        payment_status AS "paymentStatus", 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM "Invoice"
      WHERE id = ${id}::uuid
      AND tenant_id = ${tenantId}::uuid
      FOR UPDATE
    `;
    if (!result || result.length === 0) {
      throw new NotFoundException('Invoice not found or access denied');
    }
    return result[0];
  }

  async findById(
    tx: Prisma.TransactionClient,
    tenantId: string,
    id: string,
  ): Promise<Invoice | null> {
    return tx.invoice.findFirst({
      where: { id, tenantId },
    });
  }

  async update(
    tx: Prisma.TransactionClient,
    tenantId: string,
    id: string,
    data: Prisma.InvoiceUpdateInput,
  ): Promise<Invoice> {
    await tx.invoice.updateMany({
      where: { id, tenantId },
      data,
    });
    return this.findById(tx, tenantId, id) as Promise<Invoice>;
  }
}
