import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';

/**
 * Background service responsible for verifying the integrity of the audit logs.
 * Executes scheduled cron jobs to detect any tampering or broken chains.
 *
 * @class TamperDetectionService
 */
@Injectable()
export class TamperDetectionService {
  private readonly logger = new Logger(TamperDetectionService.name);

  constructor(
    private prisma: PrismaService,
    private eventBus: DomainEventPublisher,
  ) {}

  /**
   * Scheduled cron job that verifies the cryptographic hash chain of audit logs
   * across all tenants. Recalculates hashes and compares them to stored values.
   * Publishes a 'SYSTEM_TAMPERED' event if an inconsistency is detected.
   *
   * @returns {Promise<boolean>} True if all tenants have intact audit chains, false otherwise.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async verifyAuditChain() {
    this.logger.log(
      'Iniciando verificación criptográfica de la cadena de auditoría (Scheduled Job)...',
    );

    const tenants = await this.prisma.tenant.findMany();

    const verificationResults: boolean[] = [];

    for (const tenant of tenants) {
      try {
        const logs = await this.prisma.auditLog.findMany({
          where: { tenantId: tenant.id },
          orderBy: { createdAt: 'asc' },
        });
        let previousHash = 'GENESIS';
        let tenantValid = true;

        for (const log of logs) {
          const payloadString = JSON.stringify(log.payload);
          const expectedCurrentHash = crypto
            .createHash('sha256')
            .update(`${log.action}|${payloadString}`)
            .digest('hex');
          const expectedChainHash = crypto
            .createHash('sha256')
            .update(previousHash + expectedCurrentHash)
            .digest('hex');

          if (
            log.currentHash !== expectedCurrentHash ||
            log.chainHash !== expectedChainHash
          ) {
            this.logger.error(
              `¡CORRUPCIÓN DETECTADA en Tenant ${tenant.id}! AuditLog ID: ${log.id}`,
            );

            await this.eventBus.publish({
              eventName: 'SYSTEM_TAMPERED',
              tenantId: tenant.id,
              payload: { logId: log.id, issue: 'AUDIT_CHAIN_BROKEN' },
              timestamp: new Date(),
            });

            tenantValid = false;
            break;
          }
          previousHash = log.chainHash;
        }
        verificationResults.push(tenantValid);
      } catch (err) {
        this.logger.error(`Error procesando tenant ${tenant.id}`, err);
        verificationResults.push(false);
      }
    }

    if (verificationResults.includes(false)) {
      this.logger.error(
        'Validación finalizada con errores de integridad en algunos tenants.',
      );
      return false;
    }
    this.logger.log(
      'Cadena de auditoría validada exitosamente. Sin alteraciones.',
    );
    return true;
  }
}
