export declare class TemplateCreatedEvent {
    readonly tenantId: string;
    readonly templateId: string;
    readonly timestamp: Date;
    constructor(tenantId: string, templateId: string, timestamp?: Date);
}
export declare class ClauseCreatedEvent {
    readonly tenantId: string;
    readonly clauseId: string;
    readonly templateId: string;
    readonly timestamp: Date;
    constructor(tenantId: string, clauseId: string, templateId: string, timestamp?: Date);
}
