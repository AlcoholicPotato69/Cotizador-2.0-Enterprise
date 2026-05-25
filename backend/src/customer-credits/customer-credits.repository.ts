import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerCreditsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(tenantId: string, clientId: string) {
    return this.prisma.customerCreditBalance.findUnique({
      where: { tenantId_clientId: { tenantId, clientId } },
    });
  }

  async addTransaction(data: Prisma.CreditTransactionUncheckedCreateInput) {
    return this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.creditTransaction.create({ data });

      const balance = await prisma.customerCreditBalance.upsert({
        where: {
          tenantId_clientId: {
            tenantId: data.tenantId,
            clientId: data.clientId,
          },
        },
        create: {
          tenantId: data.tenantId,
          clientId: data.clientId,
          balanceAmount: data.amount,
          currencyCode: 'MXN',
        },
        update: {
          balanceAmount: { increment: data.amount },
        },
      });

      return { transaction, balance };
    });
  }
}
