export declare class HealthController {
    checkHealth(): {
        status: string;
        audit_chain_status: string;
        storage_status: string;
        database_status: string;
        queue_status: string;
        notification_status: string;
        timestamp: string;
    };
}
