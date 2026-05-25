export class CreditTransactionCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly clientId: string,
    public readonly transactionId: string,
    public readonly amount: number,
  ) {}
}

export class CreditBalanceUpdatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly clientId: string,
    public readonly newBalance: number,
  ) {}
}
