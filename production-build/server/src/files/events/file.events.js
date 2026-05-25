"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialFileCreatedEvent = exports.ContractFileCreatedEvent = exports.QuoteFileCreatedEvent = exports.ClientFileDocumentAddedEvent = exports.ClientFileCreatedEvent = void 0;
class ClientFileCreatedEvent {
    tenantId;
    clientFileId;
    clientId;
    constructor(tenantId, clientFileId, clientId) {
        this.tenantId = tenantId;
        this.clientFileId = clientFileId;
        this.clientId = clientId;
    }
}
exports.ClientFileCreatedEvent = ClientFileCreatedEvent;
class ClientFileDocumentAddedEvent {
    tenantId;
    clientFileId;
    documentId;
    documentType;
    constructor(tenantId, clientFileId, documentId, documentType) {
        this.tenantId = tenantId;
        this.clientFileId = clientFileId;
        this.documentId = documentId;
        this.documentType = documentType;
    }
}
exports.ClientFileDocumentAddedEvent = ClientFileDocumentAddedEvent;
class QuoteFileCreatedEvent {
    tenantId;
    quoteFileId;
    quoteId;
    constructor(tenantId, quoteFileId, quoteId) {
        this.tenantId = tenantId;
        this.quoteFileId = quoteFileId;
        this.quoteId = quoteId;
    }
}
exports.QuoteFileCreatedEvent = QuoteFileCreatedEvent;
class ContractFileCreatedEvent {
    tenantId;
    contractFileId;
    contractId;
    constructor(tenantId, contractFileId, contractId) {
        this.tenantId = tenantId;
        this.contractFileId = contractFileId;
        this.contractId = contractId;
    }
}
exports.ContractFileCreatedEvent = ContractFileCreatedEvent;
class FinancialFileCreatedEvent {
    tenantId;
    financialFileId;
    invoiceId;
    constructor(tenantId, financialFileId, invoiceId) {
        this.tenantId = tenantId;
        this.financialFileId = financialFileId;
        this.invoiceId = invoiceId;
    }
}
exports.FinancialFileCreatedEvent = FinancialFileCreatedEvent;
//# sourceMappingURL=file.events.js.map