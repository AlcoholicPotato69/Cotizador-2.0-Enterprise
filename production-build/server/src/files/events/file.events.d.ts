export declare class ClientFileCreatedEvent {
    readonly tenantId: string;
    readonly clientFileId: string;
    readonly clientId: string;
    constructor(tenantId: string, clientFileId: string, clientId: string);
}
export declare class ClientFileDocumentAddedEvent {
    readonly tenantId: string;
    readonly clientFileId: string;
    readonly documentId: string;
    readonly documentType: string;
    constructor(tenantId: string, clientFileId: string, documentId: string, documentType: string);
}
export declare class QuoteFileCreatedEvent {
    readonly tenantId: string;
    readonly quoteFileId: string;
    readonly quoteId: string;
    constructor(tenantId: string, quoteFileId: string, quoteId: string);
}
export declare class ContractFileCreatedEvent {
    readonly tenantId: string;
    readonly contractFileId: string;
    readonly contractId: string;
    constructor(tenantId: string, contractFileId: string, contractId: string);
}
export declare class FinancialFileCreatedEvent {
    readonly tenantId: string;
    readonly financialFileId: string;
    readonly invoiceId: string;
    constructor(tenantId: string, financialFileId: string, invoiceId: string);
}
