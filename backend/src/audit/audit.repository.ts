import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AuditLog } from '@prisma/client';

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
    return this.prisma.auditLog.create({ data });
  }

  async findLatest(tenantId: string): Promise<AuditLog | null> {
    return this.prisma.auditLog.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTenantId(tenantId: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdAndTenant(tenantId: string, id: string): Promise<AuditLog> {
    const log = await this.prisma.auditLog.findFirst({
      where: { id, tenantId },
    });
    if (!log) {
      throw new NotFoundException(`AuditLog ${id} not found for this tenant`);
    }
    return log;
  }
}
