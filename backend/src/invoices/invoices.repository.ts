import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Invoice } from '@prisma/client';

@Injectable()
export class InvoicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tx: Prisma.TransactionClient, data: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice> {
    return tx.invoice.create({ data }) as any;
  }

  async findByIdForUpdate(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Invoice> {
    const result = await tx.$queryRaw<Invoice[]>`
      SELECT * FROM "Invoice"
      WHERE id = ${id}::uuid
      AND tenant_id = ${tenantId}::uuid
      FOR UPDATE
    `;
    if (!result || result.length === 0) {
      throw new NotFoundException('Invoice not found or access denied');
    }
    return result[0];
  }

  async findById(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Invoice | null> {
    return tx.invoice.findFirst({
      where: { id, tenantId } as any
    }) as any;
  }

  async update(tx: Prisma.TransactionClient, tenantId: string, id: string, data: Prisma.InvoiceUpdateInput): Promise<Invoice> {
    return tx.invoice.update({
      where: { id, tenantId } as any,
      data,
    }) as any;
  }
}

