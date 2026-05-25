import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Document } from '@prisma/client';

@Injectable()
export class DocumentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tx: Prisma.TransactionClient,
    data: Prisma.DocumentUncheckedCreateInput,
  ): Promise<Document> {
    return tx.document.create({ data });
  }

  async findLatest(
    tx: Prisma.TransactionClient,
    tenantId: string,
  ): Promise<Document | null> {
    return tx.document.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
