import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface AuditEvent {
  tenantId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  payload: any;
}

@Injectable()
export class AuditEventPublisher {
  private lastHash: string | null = null; // Simula la lectura del último hash en BD

  async publishAudit(event: AuditEvent): Promise<void> {
    const serializedPayload = JSON.stringify(event.payload);
    
    // Hash chain implementation
    const currentHash = this.generateHash(serializedPayload);
    const previousHash = this.lastHash;
    const chainHash = this.generateHash(`${previousHash || 'GENESIS'}:${currentHash}`);

    // Persistiríamos esto vía Prisma
    console.log(`[AuditEngine] Registrando auditoría a prueba de alteraciones para ${event.entityType}:${event.entityId}. ChainHash: ${chainHash}`);
    
    this.lastHash = chainHash; // Simulación
  }

  private generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
