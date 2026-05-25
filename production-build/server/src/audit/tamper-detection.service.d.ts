import { PrismaService } from '../prisma/prisma.service';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
export declare class TamperDetectionService {
    private prisma;
    private eventBus;
    private readonly logger;
    constructor(prisma: PrismaService, eventBus: DomainEventPublisher);
    verifyAuditChain(): Promise<boolean>;
}
