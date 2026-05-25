import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, FeatureFlag } from '@prisma/client';

@Injectable()
export class FeatureFlagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.FeatureFlagCreateInput): Promise<FeatureFlag> {
    return this.prisma.featureFlag.create({ data });
  }

  async findById(id: string): Promise<FeatureFlag | null> {
    return this.prisma.featureFlag.findUnique({
      where: { id },
    });
  }

  async findFirst(
    where: Prisma.FeatureFlagWhereInput,
  ): Promise<FeatureFlag | null> {
    return this.prisma.featureFlag.findFirst({ where });
  }

  async findMany(where: Prisma.FeatureFlagWhereInput): Promise<FeatureFlag[]> {
    return this.prisma.featureFlag.findMany({ where });
  }

  async update(
    id: string,
    data: Prisma.FeatureFlagUpdateInput,
  ): Promise<FeatureFlag> {
    return this.prisma.featureFlag.update({
      where: { id },
      data,
    });
  }
}
