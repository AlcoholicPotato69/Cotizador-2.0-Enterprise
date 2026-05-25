import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PaymentEvidence } from '@prisma/client';

@Injectable()
export class PaymentEvidencesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tx: Prisma.TransactionClient,
    data: Prisma.PaymentEvidenceUncheckedCreateInput,
  ): Promise<PaymentEvidence> {
    return tx.paymentEvidence.create({ data });
  }

  async findLatest(
    tx: Prisma.TransactionClient,
    tenantId: string,
  ): Promise<PaymentEvidence | null> {
    // Acquire an advisory lock on the tenantId to serialize chain insertions for this tenant
    // This prevents the read-modify-write race condition for the chain hash
    const hashStr = tenantId.replace(/-/g, '').substring(0, 16);
    const lockId = BigInt('0x' + hashStr) % BigInt('9223372036854775807');
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockId})`;

    const result = await tx.$queryRaw<PaymentEvidence[]>`
      SELECT * FROM "PaymentEvidence"
      WHERE tenant_id = ${tenantId}::uuid
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  }
}
