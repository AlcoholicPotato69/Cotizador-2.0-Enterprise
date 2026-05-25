export declare class RegulationCreatedEvent {
    readonly tenantId: string;
    readonly regulationId: string;
    readonly timestamp: Date;
    constructor(tenantId: string, regulationId: string, timestamp?: Date);
}
export declare class RegulationAcceptedEvent {
    readonly tenantId: string;
    readonly acceptanceId: string;
    readonly regulationId: string;
    readonly acceptedBy: string;
    readonly timestamp: Date;
    constructor(tenantId: string, acceptanceId: string, regulationId: string, acceptedBy: string, timestamp?: Date);
}
