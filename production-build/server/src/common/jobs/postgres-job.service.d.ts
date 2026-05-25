import { PrismaService } from '../../prisma/prisma.service';
import { JobType } from './job-types';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PostgresJobQueueService {
    private readonly prisma;
    private readonly eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    processNextJob(): Promise<void>;
    private handleJobPayload;
    enqueueJob(tenantId: string, queueName: string, jobType: JobType, payload: Record<string, unknown>, priority?: number): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.JobStatus;
        payload: import("@prisma/client/runtime/library").JsonValue;
        correlationId: string | null;
        traceId: string | null;
        queueName: string;
        jobType: string;
        priority: number;
        scheduledFor: Date | null;
    }>;
}
