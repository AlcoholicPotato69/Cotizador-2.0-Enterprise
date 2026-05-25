export declare class SpaceConfigurationUpdatedEvent {
    readonly tenantId: string;
    readonly spaceId: string;
    readonly configKey: string;
    readonly timestamp: Date;
    constructor(tenantId: string, spaceId: string, configKey: string, timestamp?: Date);
}
export declare class SpaceRuleCreatedEvent {
    readonly tenantId: string;
    readonly spaceId: string;
    readonly ruleId: string;
    readonly ruleType: string;
    readonly timestamp: Date;
    constructor(tenantId: string, spaceId: string, ruleId: string, ruleType: string, timestamp?: Date);
}
