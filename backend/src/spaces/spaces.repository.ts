import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Space } from '@prisma/client';

@Injectable()
export class SpacesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(tenantId: string, id: string): Promise<Space | null> {
    return this.prisma.space.findFirst({
      where: { id, tenantId },
    });
  }

  async findAll(tenantId: string): Promise<Space[]> {
    return this.prisma.space.findMany({
      where: { tenantId },
    });
  }

  // Uses raw SQL for pessimistic lock
  async findByIdForUpdate(
    tx: Prisma.TransactionClient,
    tenantId: string,
    id: string,
  ): Promise<Space> {
    const result = await tx.$queryRaw<Space[]>`
      SELECT * FROM "Space" 
      WHERE id = ${id}::uuid 
      AND tenant_id = ${tenantId}::uuid 
      FOR UPDATE
    `;
    if (!result || result.length === 0) {
      throw new NotFoundException('Space not found or access denied');
    }
    return result[0];
  }

  async create(data: Prisma.SpaceUncheckedCreateInput): Promise<Space> {
    return this.prisma.space.create({ data });
  }

  async update(
    tenantId: string,
    id: string,
    data: Prisma.SpaceUpdateInput,
  ): Promise<Space> {
    const space = await this.prisma.space.findFirst({
      where: { id, tenantId },
    });
    if (!space) {
      throw new NotFoundException('Space not found or access denied');
    }
    return this.prisma.space.update({
      where: { id },
      data,
    });
  }
}
