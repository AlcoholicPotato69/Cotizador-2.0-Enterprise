import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, QuoteFile } from '@prisma/client';

@Injectable()
export class QuoteFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createQuoteFile(
    data: Prisma.QuoteFileUncheckedCreateInput,
  ): Promise<QuoteFile> {
    return this.prisma.quoteFile.create({ data });
  }

  async findQuoteFiles(
    tenantId: string,
    quoteId: string,
  ): Promise<QuoteFile[]> {
    return this.prisma.quoteFile.findMany({
      where: { tenantId, quoteId, deletedAt: null },
    });
  }

  async findQuoteFileById(
    tenantId: string,
    id: string,
  ): Promise<QuoteFile | null> {
    return this.prisma.quoteFile.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }
}
