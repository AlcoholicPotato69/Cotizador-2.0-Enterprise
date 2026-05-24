export interface DomainEvent {
    eventName: string;
    tenantId: string;
    payload: any;
    timestamp: Date;
}
export declare class DomainEventPublisher {
    publish(event: DomainEvent): Promise<void>;
}
