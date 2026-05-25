export declare class ReviewCreatedEvent {
    readonly tenantId: string;
    readonly reviewId: string;
    readonly documentId: string;
    readonly type: string;
    constructor(tenantId: string, reviewId: string, documentId: string, type: string);
}
export declare class ReviewDecisionMadeEvent {
    readonly tenantId: string;
    readonly reviewId: string;
    readonly decision: string;
    constructor(tenantId: string, reviewId: string, decision: string);
}
