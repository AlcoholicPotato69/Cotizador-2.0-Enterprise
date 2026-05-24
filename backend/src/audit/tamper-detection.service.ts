import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';

@Injectable()
export class TamperDetectionService {
  private readonly logger = new Logger(TamperDetectionService.name);

  constructor(private prisma: PrismaService, private eventBus: DomainEventPublisher) {}

  @Cron(CronExpression.EVERY_HOUR)
  async verifyAuditChain() {
    this.logger.log('Iniciando verificación criptográfica de la cadena de auditoría (Scheduled Job)...');
    
    const tenants = await this.prisma.tenant.findMany();
    
    for (const tenant of tenants) {
      const logs = await this.prisma.auditLog.findMany({ 
        where: { tenantId: tenant.id },
        orderBy: { createdAt: 'asc' } 
      });
      let previousHash = 'GENESIS';

      for (const log of logs) {
        // We have to match how it's created. In audit.service.ts, it uses `${dto.action}|${payloadString}`
        // wait, let's check audit.service.ts to see the exact formula!
        // I grepped earlier: "const currentHash = crypto.createHash('sha256').update(`${dto.action}|${payloadString}`).digest('hex');"
        const payloadString = JSON.stringify(log.payload);
        const expectedCurrentHash = crypto.createHash('sha256').update(`${log.action}|${payloadString}`).digest('hex');
        const expectedChainHash = crypto.createHash('sha256').update(previousHash + expectedCurrentHash).digest('hex');

        if (log.currentHash !== expectedCurrentHash || log.chainHash !== expectedChainHash) {
          this.logger.error(`¡CORRUPCIÓN DETECTADA en Tenant ${tenant.id}! AuditLog ID: ${log.id}`);
          
          await this.eventBus.publish({
            eventName: 'SYSTEM_TAMPERED',
            tenantId: tenant.id,
            payload: { logId: log.id, issue: 'AUDIT_CHAIN_BROKEN' },
            timestamp: new Date()
          });
          
          return false;
        }
        previousHash = log.chainHash;
      }
    }
    this.logger.log('Cadena de auditoría validada exitosamente. Sin alteraciones.');
    return true;
  }
}

