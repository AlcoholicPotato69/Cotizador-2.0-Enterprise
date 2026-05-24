export interface AuditEvent {
    tenantId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    payload: any;
}
export declare class AuditEventPublisher {
    private lastHash;
    publishAudit(event: AuditEvent): Promise<void>;
    private generateHash;
}
