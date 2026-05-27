import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Client } from '@prisma/client';

@Injectable()
export class ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    return this.prisma.client.create({ data });
  }

  async findById(id: string, tenantId?: string): Promise<Client | null> {
    const whereClause: Prisma.ClientWhereInput = { id };
    if (tenantId) {
      whereClause.tenantId = tenantId;
    }
    return this.prisma.client.findFirst({
      where: whereClause,
    });
  }

  async findFirst(where: Prisma.ClientWhereInput): Promise<Client | null> {
    return this.prisma.client.findFirst({ where });
  }

  async findMany(where: Prisma.ClientWhereInput): Promise<Client[]> {
    return this.prisma.client.findMany({ where });
  }

  async update(
    id: string,
    tenantId: string,
    data: Prisma.ClientUpdateInput,
  ): Promise<Client> {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId },
    });
    if (!client) {
      throw new NotFoundException('Client not found or access denied');
    }
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  // Soft delete enforced
  async softDelete(
    tenantId: string,
    id: string,
    deletedBy: string,
  ): Promise<Client> {
    const exists = await this.findFirst({ id, tenantId });
    if (!exists) throw new Error('Client not found or access denied');
    return this.prisma.client.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }
}
