import { PrismaService } from '../../prisma/prisma.service';
import { DomainEventPublisher } from '../events/domain-event-publisher';
export declare class OutboxProcessorService {
    private readonly prisma;
    private readonly eventPublisher;
    private readonly logger;
    constructor(prisma: PrismaService, eventPublisher: DomainEventPublisher);
    processOutbox(): Promise<void>;
}
