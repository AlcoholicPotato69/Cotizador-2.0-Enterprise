import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: Omit<Prisma.PaymentCreateInput, 'tenant' | 'tenantId' | 'status'>) {
    return this.prisma.payment.create({
      data: {
        ...data,
        status: PaymentStatus.PENDING,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, tenantId },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async findAll(tenantId: string) {
    return this.prisma.payment.findMany({
      where: { tenantId },
    });
  }

  async updateStatus(tenantId: string, id: string, status: PaymentStatus) {
    await this.findOne(tenantId, id);
    return this.prisma.payment.update({
      where: { id },
      data: { status },
    });
  }
}
