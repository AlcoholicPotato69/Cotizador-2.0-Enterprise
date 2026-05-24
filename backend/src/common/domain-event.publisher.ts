import { Injectable } from '@nestjs/common';

export interface DomainEvent {
  eventName: string;
  tenantId: string;
  payload: any;
  timestamp: Date;
}

@Injectable()
export class DomainEventPublisher {
  // Simulando integración con Event Bus / Nest EventEmitter
  async publish(event: DomainEvent): Promise<void> {
    console.log(`[DomainEventPublisher] Emitiendo evento: ${event.eventName} para Tenant: ${event.tenantId}`);
    // Aquí iría la integración real (e.g., EventEmitter2, Kafka, Redis Pub/Sub)
  }
}
