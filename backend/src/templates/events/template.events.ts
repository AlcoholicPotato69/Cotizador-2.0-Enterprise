export class TemplateCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly templateId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class ClauseCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly clauseId: string,
    public readonly templateId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
