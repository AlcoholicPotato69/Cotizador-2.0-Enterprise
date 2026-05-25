export class ReceiptGeneratedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly paymentId: string,
    public readonly receiptDocumentId: string,
  ) {}
}
