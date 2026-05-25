import { HealthService } from './health.service';
export declare class HealthController {
    private readonly service;
    constructor(service: HealthService);
    checkHealth(): Promise<{
        status: string;
        audit_chain_status: string;
        storage_status: string;
        database_status: string;
        queue_status: string;
        notification_status: string;
        timestamp: string;
    }>;
    getMetrics(user: any, limit?: number): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: string;
        serviceName: string;
        latencyMs: number | null;
        checkedAt: Date;
        errorDetails: string | null;
    }[]>;
}
