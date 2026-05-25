import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditService } from '../../audit/audit.service';

export interface DomainEvent {
  eventName: string;
  tenantId: string;
  payload: any;
  timestamp: Date;
}

@Injectable()
export class DomainEventPublisher {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly auditService: AuditService,
  ) {}

  async publish(event: DomainEvent) {
    // 1. Audit Log the Domain Event (Tamper Detection compliance)
    await this.auditService.logEvent({
      tenantId: event.tenantId,
      action: event.eventName,
      payload: event.payload,
    });

    // 2. Publish to the event bus
    this.eventEmitter.emit(event.eventName, event);
  }
}
