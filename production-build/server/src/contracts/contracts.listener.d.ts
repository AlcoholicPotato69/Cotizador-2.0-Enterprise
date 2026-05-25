import { ContractEngineService } from './contract.service';
export interface QuoteApprovedEvent {
    tenantId: string;
    payload: {
        quoteId: string;
        clientId: string;
        currencyCode?: string;
        [key: string]: unknown;
    };
}
export declare class ContractsListener {
    private readonly contractEngineService;
    private readonly logger;
    constructor(contractEngineService: ContractEngineService);
    handleQuoteStatusUpdated(event: QuoteApprovedEvent): Promise<void>;
}
