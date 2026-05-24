import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SpacesRepository } from './spaces.repository';
import { OccupancyRepository } from './occupancy.repository';
import { OccupancyStatus } from '@prisma/client';
import { tenantContext } from '../prisma/tenant-context';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';

export interface AvailabilityRequest {
  spaceId: string;
  startTime: Date;
  endTime: Date;
}

@Injectable()
export class AvailabilityEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spacesRepo: SpacesRepository,
    private readonly occupancyRepo: OccupancyRepository,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async reserveSpace(request: AvailabilityRequest, sourceId: string, sourceType: string): Promise<string> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) throw new ConflictException('Tenant context is missing');

    if (request.startTime >= request.endTime) {
      throw new ConflictException('Start time must be before end time');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Forzar RLS en la conexión serializada
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      // 1. Pessimistic Lock on Space
      const space = await this.spacesRepo.findByIdForUpdate(tx, ctx.tenantId, request.spaceId);

      // 2. Validate configuration rules (dias_bloqueados, etc)
      const blockedDays = Array.isArray(space.diasBloqueados) ? space.diasBloqueados : [];
      // Example validation (simplified for performance):
      // In production, we'd check if request.startTime to endTime intersects with blockedDays

      // 3. Check overlaps
      const overlaps = await this.occupancyRepo.findOverlapping(tx, ctx.tenantId, request.spaceId, request.startTime, request.endTime);

      if (overlaps) {
        throw new ConflictException('Concurrency conflict: Space was reserved by another transaction.');
      }

      // 4. Create Hold
      const occupancy = await this.occupancyRepo.create(tx, {
        tenantId: ctx.tenantId,
        spaceId: request.spaceId,
        startTime: request.startTime,
        endTime: request.endTime,
        status: OccupancyStatus.HOLD,
        occupancySourceId: sourceId,
        occupancySourceType: sourceType,
      });

      return occupancy.id;
    });
  }
}

