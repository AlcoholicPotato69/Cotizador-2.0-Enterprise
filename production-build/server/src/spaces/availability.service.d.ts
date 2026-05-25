import { PrismaService } from '../prisma/prisma.service';
import { SpacesRepository } from './spaces.repository';
import { OccupancyRepository } from './occupancy.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
export interface AvailabilityRequest {
    spaceId: string;
    startTime: Date;
    endTime: Date;
}
export declare class AvailabilityEngineService {
    private readonly prisma;
    private readonly spacesRepo;
    private readonly occupancyRepo;
    private readonly eventPublisher;
    constructor(prisma: PrismaService, spacesRepo: SpacesRepository, occupancyRepo: OccupancyRepository, eventPublisher: DomainEventPublisher);
    reserveSpace(request: AvailabilityRequest, sourceId: string, sourceType: string): Promise<string>;
}
