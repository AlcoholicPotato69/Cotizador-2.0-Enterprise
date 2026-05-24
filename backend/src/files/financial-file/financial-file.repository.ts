import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, FinancialFile } from '@prisma/client';

@Injectable()
export class FinancialFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createFinancialFile(data: Prisma.FinancialFileUncheckedCreateInput): Promise<FinancialFile> {
    return this.prisma.financialFile.create({ data });
  }

  async findFinancialFiles(tenantId: string, invoiceId: string): Promise<FinancialFile[]> {
    return this.prisma.financialFile.findMany({
      where: { tenantId, invoiceId, deletedAt: null },
    });
  }

  async findFinancialFileById(tenantId: string, id: string): Promise<FinancialFile | null> {
    return this.prisma.financialFile.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }
}
