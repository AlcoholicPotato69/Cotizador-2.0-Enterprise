import { QuotesRepository } from './quotes.repository';
import { QuoteStatus, Prisma } from '@prisma/client';
import { FsmValidator } from '../common/fsm.validator';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
export declare class QuotesService {
    private readonly repo;
    private readonly fsmValidator;
    private readonly eventPublisher;
    constructor(repo: QuotesRepository, fsmValidator: FsmValidator, eventPublisher: DomainEventPublisher);
    create(data: Omit<Prisma.QuoteUncheckedCreateInput, 'tenantId' | 'status'>): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.QuoteStatus;
        correlationId: string | null;
        traceId: string | null;
        currencyCode: string;
        clientId: string;
        totalAmount: Prisma.Decimal;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        desglosePrecios: Prisma.JsonValue;
    }>;
    updateStatus(id: string, targetStatus: QuoteStatus): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.QuoteStatus;
        correlationId: string | null;
        traceId: string | null;
        currencyCode: string;
        clientId: string;
        totalAmount: Prisma.Decimal;
        clientSnapshotId: string;
        occupancySnapshotId: string;
        desglosePrecios: Prisma.JsonValue;
    }>;
}
