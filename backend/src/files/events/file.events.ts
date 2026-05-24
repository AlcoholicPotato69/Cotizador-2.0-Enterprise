export class ClientFileCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly clientFileId: string,
    public readonly clientId: string,
  ) {}
}

export class ClientFileDocumentAddedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly clientFileId: string,
    public readonly documentId: string,
    public readonly documentType: string,
  ) {}
}

export class QuoteFileCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly quoteFileId: string,
    public readonly quoteId: string,
  ) {}
}

export class ContractFileCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly contractFileId: string,
    public readonly contractId: string,
  ) {}
}

export class FinancialFileCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly financialFileId: string,
    public readonly invoiceId: string,
  ) {}
}
