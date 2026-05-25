"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditBalanceUpdatedEvent = exports.CreditTransactionCreatedEvent = void 0;
class CreditTransactionCreatedEvent {
    tenantId;
    clientId;
    transactionId;
    amount;
    constructor(tenantId, clientId, transactionId, amount) {
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.transactionId = transactionId;
        this.amount = amount;
    }
}
exports.CreditTransactionCreatedEvent = CreditTransactionCreatedEvent;
class CreditBalanceUpdatedEvent {
    tenantId;
    clientId;
    newBalance;
    constructor(tenantId, clientId, newBalance) {
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.newBalance = newBalance;
    }
}
exports.CreditBalanceUpdatedEvent = CreditBalanceUpdatedEvent;
//# sourceMappingURL=customer-credits.events.js.map