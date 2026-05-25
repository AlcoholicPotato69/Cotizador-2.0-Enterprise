import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Quote } from '@prisma/client';

@Injectable()
export class QuotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.QuoteUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Quote> {
    const client = tx || this.prisma;
    return client.quote.create({ data });
  }

  async findByIdForUpdate(
    tx: Prisma.TransactionClient,
    tenantId: string,
    id: string,
  ): Promise<Quote> {
    const result = await tx.$queryRaw<Quote[]>`
      SELECT * FROM "Quote" 
      WHERE id = ${id}::uuid 
      AND tenant_id = ${tenantId}::uuid 
      FOR UPDATE
    `;
    if (!result || result.length === 0) {
      throw new Error('Quote not found or access denied');
    }
    return result[0];
  }

  async findById(
    tenantId: string,
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Quote | null> {
    const client = tx || this.prisma;
    return client.quote.findFirst({
      where: { id, tenantId },
    });
  }

  async findFirst(where: Prisma.QuoteWhereInput): Promise<Quote | null> {
    return this.prisma.quote.findFirst({ where });
  }

  async findMany(where: Prisma.QuoteWhereInput): Promise<Quote[]> {
    return this.prisma.quote.findMany({ where });
  }

  async update(
    tenantId: string,
    id: string,
    data: Prisma.QuoteUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Quote> {
    // Para asegurar RLS estricto, primero buscamos si existe
    const exists = await this.findById(tenantId, id, tx);
    if (!exists) throw new Error('Quote not found or access denied');

    const client = tx || this.prisma;
    return client.quote.update({
      where: { id_tenantId: { id, tenantId } } as any,
      data,
    });
  }
}
