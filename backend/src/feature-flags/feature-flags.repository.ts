import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, FeatureFlag } from '@prisma/client';

@Injectable()
export class FeatureFlagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.FeatureFlagCreateInput): Promise<FeatureFlag> {
    return this.prisma.featureFlag.create({ data }) as any;
  }

  async findById(id: string): Promise<FeatureFlag | null> {
    return this.prisma.featureFlag.findUnique({
      where: { id } as any,
    }) as any;
  }

  async findFirst(where: Prisma.FeatureFlagWhereInput): Promise<FeatureFlag | null> {
    return this.prisma.featureFlag.findFirst({ where }) as any;
  }

  async findMany(where: Prisma.FeatureFlagWhereInput): Promise<FeatureFlag[]> {
    return this.prisma.featureFlag.findMany({ where }) as any;
  }

  async update(id: string, data: Prisma.FeatureFlagUpdateInput): Promise<FeatureFlag> {
    return this.prisma.featureFlag.update({
      where: { id } as any,
      data,
    }) as any;
  }
}

