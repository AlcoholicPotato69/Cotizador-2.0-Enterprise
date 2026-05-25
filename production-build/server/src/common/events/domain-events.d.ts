export declare abstract class BaseDomainEvent {
    readonly eventName: string;
    readonly tenantId: string;
    readonly payload: any;
    readonly timestamp: Date;
    constructor(eventName: string, tenantId: string, payload: any);
}
export declare class QuoteApprovedEvent extends BaseDomainEvent {
    constructor(tenantId: string, payload: {
        quoteId: string;
    });
}
export declare class ContractSignedEvent extends BaseDomainEvent {
    constructor(tenantId: string, payload: {
        contractId: string;
    });
}
export declare class PaymentApprovedEvent extends BaseDomainEvent {
    constructor(tenantId: string, payload: {
        paymentId: string;
        invoiceId: string;
        amount: number;
    });
}
export declare class PaymentRejectedEvent extends BaseDomainEvent {
    constructor(tenantId: string, payload: {
        paymentId: string;
        reason: string;
    });
}
export declare class InvoiceGeneratedEvent extends BaseDomainEvent {
    constructor(tenantId: string, payload: {
        invoiceId: string;
        contractId?: string;
    });
}
export declare class SnapshotRequestedEvent extends BaseDomainEvent {
    constructor(tenantId: string, payload: {
        entityId: string;
        entityType: string;
        data: any;
    });
}
