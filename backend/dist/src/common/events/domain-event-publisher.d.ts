import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditService } from '../../audit/audit.service';
export interface DomainEvent {
    eventName: string;
    tenantId: string;
    payload: any;
    timestamp: Date;
}
export declare class DomainEventPublisher {
    private readonly eventEmitter;
    private readonly auditService;
    constructor(eventEmitter: EventEmitter2, auditService: AuditService);
    publish(event: DomainEvent): Promise<void>;
}
