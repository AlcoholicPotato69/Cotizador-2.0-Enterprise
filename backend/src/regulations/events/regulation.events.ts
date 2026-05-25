export class RegulationCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly regulationId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class RegulationAcceptedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly acceptanceId: string,
    public readonly regulationId: string,
    public readonly acceptedBy: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
