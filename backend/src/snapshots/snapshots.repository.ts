import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Snapshot } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class SnapshotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SnapshotCreateInput): Promise<Snapshot> {
    return this.prisma.snapshot.create({ data });
  }

  async findLatestByType(
    entityType: string,
    tenantId: string,
  ): Promise<Snapshot | null> {
    return this.prisma.snapshot.findFirst({
      where: { entityType, tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
