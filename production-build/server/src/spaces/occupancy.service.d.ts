import { OccupancyRepository } from './occupancy.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class OccupancyService {
    private readonly repo;
    private readonly prisma;
    private readonly eventPublisher;
    constructor(repo: OccupancyRepository, prisma: PrismaService, eventPublisher: DomainEventPublisher);
    createOccupancy(data: Omit<Prisma.SpaceOccupancyUncheckedCreateInput, 'tenantId'>): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.OccupancyStatus;
        correlationId: string | null;
        traceId: string | null;
        spaceId: string;
        occupancySourceType: string;
        occupancySourceId: string;
        startTime: Date;
        endTime: Date;
    }>;
}
