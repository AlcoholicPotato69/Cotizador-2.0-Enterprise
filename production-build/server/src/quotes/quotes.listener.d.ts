import { QuotesService } from './quotes.service';
export interface ContractGeneratedEvent {
    tenantId: string;
    payload: {
        quoteId: string;
        [key: string]: unknown;
    };
}
export declare class QuotesListener {
    private readonly quotesService;
    private readonly logger;
    constructor(quotesService: QuotesService);
    handleContractGenerated(event: ContractGeneratedEvent): Promise<void>;
}
