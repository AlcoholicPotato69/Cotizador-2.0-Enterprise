import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, featureKey: string, enabled: boolean = false, rolloutPercentage: number = 100) {
    return this.prisma.featureFlag.create({
      data: {
        tenantId,
        featureKey,
        enabled,
        rolloutPercentage,
      },
    });
  }

  async isEnabled(tenantId: string, featureKey: string): Promise<boolean> {
    const flag = await this.prisma.featureFlag.findFirst({
      where: { tenantId, featureKey },
    });
    
    if (!flag) return false;
    
    if (!flag.enabled) return false;

    // Simple rollout percentage check
    const random = Math.floor(Math.random() * 100) + 1;
    return random <= flag.rolloutPercentage;
  }

  async toggleFlag(tenantId: string, featureKey: string, enabled: boolean) {
    const flag = await this.prisma.featureFlag.findFirst({
      where: { tenantId, featureKey },
    });

    if (!flag) throw new NotFoundException('Feature flag not found');

    return this.prisma.featureFlag.update({
      where: { id: flag.id },
      data: { enabled },
    });
  }
}
