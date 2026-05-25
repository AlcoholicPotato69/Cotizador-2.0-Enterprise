import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PaymentAllocation } from '@prisma/client';

@Injectable()
export class PaymentAllocationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tx: Prisma.TransactionClient,
    data: Prisma.PaymentAllocationUncheckedCreateInput,
  ): Promise<PaymentAllocation> {
    return tx.paymentAllocation.create({ data });
  }

  async findByPaymentId(
    tenantId: string,
    paymentId: string,
  ): Promise<PaymentAllocation[]> {
    return this.prisma.paymentAllocation.findMany({
      where: { tenantId, paymentId },
    });
  }

  async findByInvoiceId(
    tenantId: string,
    invoiceId: string,
  ): Promise<PaymentAllocation[]> {
    return this.prisma.paymentAllocation.findMany({
      where: { tenantId, invoiceId },
    });
  }
}
