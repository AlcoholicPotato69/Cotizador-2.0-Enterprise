import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, SpaceOccupancy } from '@prisma/client';

@Injectable()
export class OccupancyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tx: Prisma.TransactionClient, data: Prisma.SpaceOccupancyUncheckedCreateInput): Promise<SpaceOccupancy> {
    return tx.spaceOccupancy.create({ data }) as any;
  }

  async findOverlapping(tx: Prisma.TransactionClient, tenantId: string, spaceId: string, startTime: Date, endTime: Date): Promise<SpaceOccupancy | null> {
    return tx.spaceOccupancy.findFirst({
      where: {
        tenantId,
        spaceId,
        status: {
          in: ['HOLD', 'RESERVED', 'CONTRACTED']
        },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      }
    }) as any;
  }
}
