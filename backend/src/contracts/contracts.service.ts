import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ContractStatus } from '@prisma/client';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: Omit<Prisma.ContractCreateInput, 'tenant' | 'tenantId' | 'status'>) {
    return this.prisma.contract.create({
      data: {
        ...data,
        status: ContractStatus.DRAFT,
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const contract = await this.prisma.contract.findFirst({
      where: { id, tenantId },
    });
    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async findAll(tenantId: string) {
    return this.prisma.contract.findMany({
      where: { tenantId },
    });
  }

  async updateStatus(tenantId: string, id: string, status: ContractStatus) {
    await this.findOne(tenantId, id);
    return this.prisma.contract.update({
      where: { id },
      data: { status },
    });
  }
}
