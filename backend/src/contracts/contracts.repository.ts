import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Contract } from '@prisma/client';

@Injectable()
export class ContractsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tx: Prisma.TransactionClient,
    data: Prisma.ContractUncheckedCreateInput,
  ): Promise<Contract> {
    return tx.contract.create({ data });
  }

  async findById(tenantId: string, id: string): Promise<Contract | null> {
    return this.prisma.contract.findFirst({
      where: { id, tenantId },
    });
  }

  async findMany(tenantId: string): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdForUpdate(
    tx: Prisma.TransactionClient,
    tenantId: string,
    id: string,
  ): Promise<Contract> {
    const result = await tx.$queryRaw<Contract[]>`
      SELECT * FROM "Contract" 
      WHERE id = ${id}::uuid 
      AND tenant_id = ${tenantId}::uuid 
      FOR UPDATE
    `;
    if (!result || result.length === 0) {
      throw new NotFoundException('Contract not found or access denied');
    }
    return result[0];
  }

  async update(
    tx: Prisma.TransactionClient,
    tenantId: string,
    id: string,
    data: Prisma.ContractUpdateInput,
  ): Promise<Contract> {
    return tx.contract.update({
      where: { id_tenantId: { id, tenantId } } as any,
      data,
    });
  }
}
