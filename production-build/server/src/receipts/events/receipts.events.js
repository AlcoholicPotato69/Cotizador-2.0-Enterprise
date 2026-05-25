"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptGeneratedEvent = void 0;
class ReceiptGeneratedEvent {
    tenantId;
    paymentId;
    receiptDocumentId;
    constructor(tenantId, paymentId, receiptDocumentId) {
        this.tenantId = tenantId;
        this.paymentId = paymentId;
        this.receiptDocumentId = receiptDocumentId;
    }
}
exports.ReceiptGeneratedEvent = ReceiptGeneratedEvent;
//# sourceMappingURL=receipts.events.js.map