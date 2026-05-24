import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PaymentEvidence } from '@prisma/client';

@Injectable()
export class PaymentEvidencesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tx: Prisma.TransactionClient, data: Prisma.PaymentEvidenceUncheckedCreateInput): Promise<PaymentEvidence> {
    return tx.paymentEvidence.create({ data }) as any;
  }

  async findLatest(tx: Prisma.TransactionClient, tenantId: string): Promise<PaymentEvidence | null> {
    const result = await tx.$queryRaw<PaymentEvidence[]>`
      SELECT * FROM "PaymentEvidence"
      WHERE tenant_id = ${tenantId}::uuid
      ORDER BY created_at DESC
      LIMIT 1
      FOR UPDATE
    `;
    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  }
}
