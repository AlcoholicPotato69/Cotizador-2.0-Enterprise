import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Signature } from '@prisma/client';

@Injectable()
export class SignaturesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tx: Prisma.TransactionClient,
    data: Prisma.SignatureUncheckedCreateInput,
  ): Promise<Signature> {
    return tx.signature.create({ data });
  }

  async countByContract(
    tx: Prisma.TransactionClient,
    tenantId: string,
    contractId: string,
  ): Promise<number> {
    return tx.signature.count({
      where: { contractId, tenantId },
    });
  }
}
