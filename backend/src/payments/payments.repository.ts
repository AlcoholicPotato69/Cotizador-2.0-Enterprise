import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Payment } from '@prisma/client';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tx: Prisma.TransactionClient, data: Prisma.PaymentUncheckedCreateInput): Promise<Payment> {
    return tx.payment.create({ data }) as any;
  }

  async findByIdForUpdate(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Payment> {
    const result = await tx.$queryRaw<Payment[]>`
      SELECT * FROM "Payment"
      WHERE id = ${id}::uuid
      AND tenant_id = ${tenantId}::uuid
      FOR UPDATE
    `;
    if (!result || result.length === 0) {
      throw new NotFoundException('Payment not found or access denied');
    }
    return result[0];
  }

  async findById(tx: Prisma.TransactionClient, tenantId: string, id: string): Promise<Payment | null> {
    return tx.payment.findFirst({
      where: { id, tenantId } as any
    }) as any;
  }

  async update(tx: Prisma.TransactionClient, tenantId: string, id: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
    return tx.payment.update({
      where: { id, tenantId } as any,
      data,
    }) as any;
  }
}
