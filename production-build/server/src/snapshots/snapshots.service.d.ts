import { SnapshotsRepository } from './snapshots.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
export interface CreateSnapshotDto {
    entityType: string;
    payload: any;
}
export declare class SnapshotsService {
    private readonly repo;
    private readonly eventPublisher;
    constructor(repo: SnapshotsRepository, eventPublisher: DomainEventPublisher);
    createSnapshot(dto: CreateSnapshotDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        payload: import("@prisma/client/runtime/library").JsonValue;
        previousHash: string | null;
        chainHash: string;
        entityType: string;
        payloadHash: string;
        version: number;
    }>;
}
