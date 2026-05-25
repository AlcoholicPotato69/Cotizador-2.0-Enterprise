import { PrismaService } from '../../prisma/prisma.service';
export declare class InboxService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    processIdempotent(tenantId: string, eventId: string, eventType: string, payload: Record<string, unknown>, handler: () => Promise<void>): Promise<void>;
}
