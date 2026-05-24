import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AuditLog } from '@prisma/client';

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
    return this.prisma.auditLog.create({ data }) as any;
  }

  async findLatest(tenantId: string): Promise<AuditLog | null> {
    return this.prisma.auditLog.findFirst({
      where: { tenantId } as any,
      orderBy: { createdAt: 'desc' } as any,
    }) as any;
  }
}

