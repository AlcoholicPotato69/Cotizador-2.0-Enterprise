import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { OccupancyRepository } from './occupancy.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OccupancyService {
  constructor(
    private readonly repo: OccupancyRepository,
    private readonly prisma: PrismaService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async createOccupancy(
    data: Omit<Prisma.SpaceOccupancyUncheckedCreateInput, 'tenantId'>,
  ) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');

    return await this.prisma.$transaction(async (tx) => {
      const overlapping = await this.repo.findOverlapping(
        tx,
        ctx.tenantId,
        data.spaceId,
        new Date(data.startTime),
        new Date(data.endTime),
      );

      if (overlapping) {
        throw new ConflictException(
          'Space is already occupied during this time',
        );
      }

      const occupancy = await this.repo.create(tx, {
        ...data,
        tenantId: ctx.tenantId,
      });

      await this.eventPublisher.publish({
        eventName: 'occupancy.created',
        tenantId: ctx.tenantId,
        payload: { occupancyId: occupancy.id, spaceId: occupancy.spaceId },
        timestamp: new Date(),
      });

      return occupancy;
    });
  }
}
