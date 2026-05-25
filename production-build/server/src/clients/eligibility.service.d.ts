import { ClientsRepository } from './clients.repository';
export declare enum TransactionType {
    QUOTE_CREATION = "QUOTE_CREATION",
    CONTRACT_GENERATION = "CONTRACT_GENERATION",
    INVOICE_GENERATION = "INVOICE_GENERATION",
    PAYMENT_PROCESSING = "PAYMENT_PROCESSING"
}
export declare class EligibilityEngineService {
    private readonly clientsRepo;
    constructor(clientsRepo: ClientsRepository);
    evaluateEligibility(clientId: string, transactionType: TransactionType): Promise<boolean>;
}
