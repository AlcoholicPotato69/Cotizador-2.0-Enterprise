import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RegisterHealthMetricDto {
  tenantId: string;
  serviceName: string;
  status: string;
  latencyMs?: number;
  errorDetails?: string;
}

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', db: 'connected' };
  }

  async registerMetric(dto: RegisterHealthMetricDto) {
    return this.prisma.healthCheckMetric.create({
      data: {
        tenantId: dto.tenantId,
        serviceName: dto.serviceName,
        status: dto.status,
        latencyMs: dto.latencyMs,
        errorDetails: dto.errorDetails,
        checkedAt: new Date(),
      },
    });
  }

  async getMetricsByTenant(tenantId: string, limit = 50) {
    return this.prisma.healthCheckMetric.findMany({
      where: { tenantId },
      orderBy: { checkedAt: 'desc' },
      take: limit,
    });
  }
}
