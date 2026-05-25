"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotRequestedEvent = exports.InvoiceGeneratedEvent = exports.PaymentRejectedEvent = exports.PaymentApprovedEvent = exports.ContractSignedEvent = exports.QuoteApprovedEvent = exports.BaseDomainEvent = void 0;
class BaseDomainEvent {
    eventName;
    tenantId;
    payload;
    timestamp = new Date();
    constructor(eventName, tenantId, payload) {
        this.eventName = eventName;
        this.tenantId = tenantId;
        this.payload = payload;
    }
}
exports.BaseDomainEvent = BaseDomainEvent;
class QuoteApprovedEvent extends BaseDomainEvent {
    constructor(tenantId, payload) {
        super('quote.approved', tenantId, payload);
    }
}
exports.QuoteApprovedEvent = QuoteApprovedEvent;
class ContractSignedEvent extends BaseDomainEvent {
    constructor(tenantId, payload) {
        super('contract.signed', tenantId, payload);
    }
}
exports.ContractSignedEvent = ContractSignedEvent;
class PaymentApprovedEvent extends BaseDomainEvent {
    constructor(tenantId, payload) {
        super('payment.approved', tenantId, payload);
    }
}
exports.PaymentApprovedEvent = PaymentApprovedEvent;
class PaymentRejectedEvent extends BaseDomainEvent {
    constructor(tenantId, payload) {
        super('payment.rejected', tenantId, payload);
    }
}
exports.PaymentRejectedEvent = PaymentRejectedEvent;
class InvoiceGeneratedEvent extends BaseDomainEvent {
    constructor(tenantId, payload) {
        super('invoice.generated', tenantId, payload);
    }
}
exports.InvoiceGeneratedEvent = InvoiceGeneratedEvent;
class SnapshotRequestedEvent extends BaseDomainEvent {
    constructor(tenantId, payload) {
        super('snapshot.requested', tenantId, payload);
    }
}
exports.SnapshotRequestedEvent = SnapshotRequestedEvent;
//# sourceMappingURL=domain-events.js.map