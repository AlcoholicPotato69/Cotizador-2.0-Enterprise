import { CreditTransactionCreatedEvent, CreditBalanceUpdatedEvent } from './events/customer-credits.events';
import { CustomerCreditsService } from './customer-credits.service';
export declare class CustomerCreditsListener {
    private readonly customerCreditsService;
    private readonly logger;
    constructor(customerCreditsService: CustomerCreditsService);
    handleTransactionCreated(event: CreditTransactionCreatedEvent): void;
    handleBalanceUpdated(event: CreditBalanceUpdatedEvent): void;
    handleInvoiceOverpaid(event: any): Promise<void>;
}
