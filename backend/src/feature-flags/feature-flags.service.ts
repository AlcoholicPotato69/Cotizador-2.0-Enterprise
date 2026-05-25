import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { tenantContext } from '../prisma/tenant-context';

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeatureFlag(key: string) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) {
      throw new NotFoundException('Tenant context missing');
    }

    return this.prisma.featureFlag.findFirst({
      where: {
        featureKey: key,
        tenantId: ctx.tenantId,
      },
    });
  }
}
