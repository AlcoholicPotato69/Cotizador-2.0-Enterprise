import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ContractFile } from '@prisma/client';

@Injectable()
export class ContractFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createContractFile(
    data: Prisma.ContractFileUncheckedCreateInput,
  ): Promise<ContractFile> {
    return this.prisma.contractFile.create({ data });
  }

  async findContractFiles(
    tenantId: string,
    contractId: string,
  ): Promise<ContractFile[]> {
    return this.prisma.contractFile.findMany({
      where: { tenantId, contractId, deletedAt: null },
    });
  }

  async findContractFileById(
    tenantId: string,
    id: string,
  ): Promise<ContractFile | null> {
    return this.prisma.contractFile.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }
}
