export declare class ReceiptGeneratedEvent {
    readonly tenantId: string;
    readonly paymentId: string;
    readonly receiptDocumentId: string;
    constructor(tenantId: string, paymentId: string, receiptDocumentId: string);
}
