import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { tenantContext } from '../prisma/tenant-context';
import { Prisma, OccupancyStatus } from '@prisma/client';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RescheduleReservationDto } from './dto/reschedule-reservation.dto';

@Injectable()
export class AgendaService {
  constructor(private readonly prisma: PrismaService) {}

  private getTenantId(): string {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new NotFoundException('Tenant context missing');
    return ctx.tenantId;
  }

  async findAll() {
    const tenantId = this.getTenantId();
    return this.prisma.spaceOccupancy.findMany({
      where: { tenantId },
      include: {
        space: true,
      },
    });
  }

  // 1. Reserva
  async reserve(data: CreateReservationDto) {
    const tenantId = this.getTenantId();
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    return await this.prisma.$transaction(
      async (tx) => {
        // Serializable transaction to avoid double booking
        const overlap = await tx.spaceOccupancy.findFirst({
          where: {
            tenantId,
            spaceId: data.spaceId,
            status: {
              in: [
                OccupancyStatus.HOLD,
                OccupancyStatus.RESERVED,
                OccupancyStatus.CONTRACTED,
              ],
            },
            OR: [
              {
                startTime: { lt: endTime },
                endTime: { gt: startTime },
              },
            ],
          },
        });

        if (overlap) {
          throw new ConflictException(
            'Space is already booked for the given time slot',
          );
        }

        return await tx.spaceOccupancy.create({
          data: {
            tenantId,
            spaceId: data.spaceId,
            startTime,
            endTime,
            status: OccupancyStatus.RESERVED,
            occupancySourceType: data.occupancySourceType || 'AGENDA',
            occupancySourceId: data.occupancySourceId || 'direct-booking',
            correlationId: data.correlationId,
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  // 2. Reprogramación / Cambio de fecha
  async reschedule(id: string, data: RescheduleReservationDto) {
    const tenantId = this.getTenantId();
    const newStartTime = new Date(data.startTime);
    const newEndTime = new Date(data.endTime);

    if (newStartTime >= newEndTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    return await this.prisma.$transaction(
      async (tx) => {
        const reservation = await tx.spaceOccupancy.findFirst({
          where: { id, tenantId },
        });

        if (!reservation) {
          throw new NotFoundException('Reservation not found');
        }

        if (
          reservation.status === OccupancyStatus.CANCELLED ||
          reservation.status === OccupancyStatus.EXPIRED ||
          reservation.status === OccupancyStatus.RELEASED
        ) {
          throw new BadRequestException(
            'Cannot reschedule an inactive reservation',
          );
        }

        const overlap = await tx.spaceOccupancy.findFirst({
          where: {
            tenantId,
            spaceId: reservation.spaceId,
            id: { not: id },
            status: {
              in: [
                OccupancyStatus.HOLD,
                OccupancyStatus.RESERVED,
                OccupancyStatus.CONTRACTED,
              ],
            },
            OR: [
              {
                startTime: { lt: newEndTime },
                endTime: { gt: newStartTime },
              },
            ],
          },
        });

        if (overlap) {
          throw new ConflictException(
            'Space is already booked for the new time slot',
          );
        }

        return await tx.spaceOccupancy.update({
          where: { id },
          data: {
            startTime: newStartTime,
            endTime: newEndTime,
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  // 3. Liberación
  async release(id: string) {
    const tenantId = this.getTenantId();
    const reservation = await this.prisma.spaceOccupancy.findFirst({
      where: { id, tenantId },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return await this.prisma.spaceOccupancy.update({
      where: { id },
      data: { status: OccupancyStatus.RELEASED },
    });
  }

  // 4. Cancelación
  async cancel(id: string) {
    const tenantId = this.getTenantId();
    const reservation = await this.prisma.spaceOccupancy.findFirst({
      where: { id, tenantId },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return await this.prisma.spaceOccupancy.update({
      where: { id },
      data: { status: OccupancyStatus.CANCELLED },
    });
  }

  // 5. Expiración
  async expire(id: string) {
    const tenantId = this.getTenantId();
    const reservation = await this.prisma.spaceOccupancy.findFirst({
      where: { id, tenantId },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return await this.prisma.spaceOccupancy.update({
      where: { id },
      data: { status: OccupancyStatus.EXPIRED },
    });
  }
}
