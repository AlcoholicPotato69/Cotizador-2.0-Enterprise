export abstract class BaseDomainEvent {
  public readonly timestamp: Date = new Date();
  
  constructor(
    public readonly eventName: string,
    public readonly tenantId: string,
    public readonly payload: any
  ) {}
}

export class QuoteApprovedEvent extends BaseDomainEvent {
  constructor(tenantId: string, payload: { quoteId: string }) {
    super('quote.approved', tenantId, payload);
  }
}

export class ContractSignedEvent extends BaseDomainEvent {
  constructor(tenantId: string, payload: { contractId: string }) {
    super('contract.signed', tenantId, payload);
  }
}

export class PaymentApprovedEvent extends BaseDomainEvent {
  constructor(tenantId: string, payload: { paymentId: string; invoiceId: string; amount: number }) {
    super('payment.approved', tenantId, payload);
  }
}

export class PaymentRejectedEvent extends BaseDomainEvent {
  constructor(tenantId: string, payload: { paymentId: string; reason: string }) {
    super('payment.rejected', tenantId, payload);
  }
}

export class InvoiceGeneratedEvent extends BaseDomainEvent {
  constructor(tenantId: string, payload: { invoiceId: string, contractId?: string }) {
    super('invoice.generated', tenantId, payload);
  }
}

export class SnapshotRequestedEvent extends BaseDomainEvent {
  constructor(tenantId: string, payload: { entityId: string, entityType: string, data: any }) {
    super('snapshot.requested', tenantId, payload);
  }
}
