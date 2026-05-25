import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class WorkflowEngineService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    executeTransition(tenantId: string, workflowVersionId: string, currentStateId: string, actionName: string, contextPayload: any): Promise<string>;
    private evaluateConditions;
}
