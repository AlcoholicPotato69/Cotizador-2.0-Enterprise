export declare class CreditTransactionCreatedEvent {
    readonly tenantId: string;
    readonly clientId: string;
    readonly transactionId: string;
    readonly amount: number;
    constructor(tenantId: string, clientId: string, transactionId: string, amount: number);
}
export declare class CreditBalanceUpdatedEvent {
    readonly tenantId: string;
    readonly clientId: string;
    readonly newBalance: number;
    constructor(tenantId: string, clientId: string, newBalance: number);
}
