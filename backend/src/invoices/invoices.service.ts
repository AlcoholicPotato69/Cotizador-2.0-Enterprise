import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: Omit<Prisma.InvoiceCreateInput, 'tenant' | 'tenantId' | 'status'>) {
    return this.prisma.invoice.create({
      data: {
        ...data,
        status: InvoiceStatus.DRAFT,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, tenantId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async findAll(tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId },
    });
  }

  async updateStatus(tenantId: string, id: string, status: InvoiceStatus) {
    await this.findOne(tenantId, id);
    return this.prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }
}
