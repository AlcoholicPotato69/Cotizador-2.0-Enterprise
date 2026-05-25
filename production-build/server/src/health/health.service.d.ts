import { PrismaService } from '../prisma/prisma.service';
export interface RegisterHealthMetricDto {
    tenantId: string;
    serviceName: string;
    status: string;
    latencyMs?: number;
    errorDetails?: string;
}
export declare class HealthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkHealth(): Promise<{
        status: string;
        db: string;
    }>;
    registerMetric(dto: RegisterHealthMetricDto): Promise<{
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
    }>;
    getMetricsByTenant(tenantId: string, limit?: number): Promise<{
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
