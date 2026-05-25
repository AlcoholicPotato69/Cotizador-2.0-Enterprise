import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ArchiveEngineService {
  private readonly logger = new Logger(ArchiveEngineService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Archiva una entidad de forma lógica
   */
  async archiveEntity(
    model: 'Client' | 'Contract' | 'Quote' | 'Document',
    id: string,
    archivedBy: string,
  ) {
    this.logger.log(`Archiving ${model} with ID ${id} by ${archivedBy}`);

    // Inyectamos validación de tenant
    const { tenantContext } = require('../prisma/tenant-context');
    const ctx = tenantContext.getStore();

    if (!ctx || !ctx.tenantId) {
      // Para logs de sistema como applyRetentionPolicies
      if (archivedBy !== 'SYSTEM_RETENTION_POLICY') {
        throw new Error('Tenant context required for archiving');
      }
    }
    const tenantId = ctx?.tenantId;
    const now = new Date();

    switch (model) {
      case 'Client':
        if (tenantId) {
          const exists = await this.prisma.client.findFirst({
            where: { id, tenantId },
          });
          if (!exists) throw new Error('Not found or access denied');
        }
        return this.prisma.client.update({
          where: { id },
          data: { status: 'ARCHIVED', deletedAt: now, deletedBy: archivedBy },
        });
      case 'Quote':
        if (tenantId) {
          const exists = await this.prisma.quote.findFirst({
            where: { id, tenantId },
          });
          if (!exists) throw new Error('Not found or access denied');
        }
        return this.prisma.quote.update({
          where: { id },
          data: { status: 'EXPIRED', deletedAt: now, deletedBy: archivedBy },
        });
      case 'Contract':
        if (tenantId) {
          const exists = await this.prisma.contract.findFirst({
            where: { id, tenantId },
          });
          if (!exists) throw new Error('Not found or access denied');
        }
        return this.prisma.contract.update({
          where: { id },
          data: { status: 'TERMINATED', deletedAt: now, deletedBy: archivedBy },
        });
      case 'Document':
        if (tenantId) {
          const exists = await this.prisma.document.findFirst({
            where: { id, tenantId },
          });
          if (!exists) throw new Error('Not found or access denied');
        }
        return this.prisma.document.update({
          where: { id },
          data: { deletedAt: now, deletedBy: archivedBy },
        });
      default:
        throw new Error(`Model ${model} not supported for archiving.`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async applyRetentionPolicies() {
    this.logger.log('Running retention policies...');

    const { tenantContext } = require('../prisma/tenant-context');
    const ctx = tenantContext?.getStore();
    const tenantId = ctx?.tenantId;

    const now = new Date();

    // Archivar documentos cuyo tiempo de retención ya expiró y no están en legal hold
    const whereClause: any = {
      retentionUntil: { lte: now },
      legalHold: false,
      deletedAt: null,
    };

    if (tenantId) {
      whereClause.tenantId = tenantId;
    }

    const expiredDocuments = await this.prisma.document.findMany({
      where: whereClause,
    });

    if (expiredDocuments.length > 0) {
      const ids = expiredDocuments.map((d) => d.id);
      await this.prisma.document.updateMany({
        where: { id: { in: ids } },
        data: { deletedAt: now, deletedBy: 'SYSTEM_RETENTION_POLICY' },
      });
    }

    this.logger.log(`Archived ${expiredDocuments.length} expired documents.`);
  }
}
