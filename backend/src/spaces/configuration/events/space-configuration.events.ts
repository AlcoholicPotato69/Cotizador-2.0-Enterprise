export class SpaceConfigurationUpdatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly spaceId: string,
    public readonly configKey: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class SpaceRuleCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly spaceId: string,
    public readonly ruleId: string,
    public readonly ruleType: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
