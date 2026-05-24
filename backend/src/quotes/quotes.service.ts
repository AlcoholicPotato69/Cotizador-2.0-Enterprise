import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, QuoteStatus } from '@prisma/client';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: Omit<Prisma.QuoteCreateInput, 'tenant' | 'tenantId' | 'status'>) {
    return this.prisma.quote.create({
      data: {
        ...data,
        status: QuoteStatus.DRAFT,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, tenantId },
    });
    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  async findAll(tenantId: string) {
    return this.prisma.quote.findMany({
      where: { tenantId },
    });
  }

  async updateStatus(tenantId: string, id: string, status: QuoteStatus) {
    await this.findOne(tenantId, id);
    return this.prisma.quote.update({
      where: { id },
      data: { status },
    });
  }
}
