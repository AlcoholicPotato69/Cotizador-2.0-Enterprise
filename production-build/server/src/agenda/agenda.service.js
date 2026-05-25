"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_context_1 = require("../prisma/tenant-context");
const client_1 = require("@prisma/client");
let AgendaService = class AgendaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getTenantId() {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.NotFoundException('Tenant context missing');
        return ctx.tenantId;
    }
    async reserve(data) {
        const tenantId = this.getTenantId();
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);
        if (startTime >= endTime) {
            throw new common_1.BadRequestException('startTime must be before endTime');
        }
        return await this.prisma.$transaction(async (tx) => {
            const overlap = await tx.spaceOccupancy.findFirst({
                where: {
                    tenantId,
                    spaceId: data.spaceId,
                    status: { in: [client_1.OccupancyStatus.HOLD, client_1.OccupancyStatus.RESERVED, client_1.OccupancyStatus.CONTRACTED] },
                    OR: [
                        {
                            startTime: { lt: endTime },
                            endTime: { gt: startTime },
                        },
                    ],
                },
            });
            if (overlap) {
                throw new common_1.ConflictException('Space is already booked for the given time slot');
            }
            return await tx.spaceOccupancy.create({
                data: {
                    tenantId,
                    spaceId: data.spaceId,
                    startTime,
                    endTime,
                    status: client_1.OccupancyStatus.RESERVED,
                    occupancySourceType: data.occupancySourceType || 'AGENDA',
                    occupancySourceId: data.occupancySourceId || 'direct-booking',
                    correlationId: data.correlationId,
                },
            });
        }, {
            isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
        });
    }
    async reschedule(id, data) {
        const tenantId = this.getTenantId();
        const newStartTime = new Date(data.startTime);
        const newEndTime = new Date(data.endTime);
        if (newStartTime >= newEndTime) {
            throw new common_1.BadRequestException('startTime must be before endTime');
        }
        return await this.prisma.$transaction(async (tx) => {
            const reservation = await tx.spaceOccupancy.findFirst({
                where: { id, tenantId },
            });
            if (!reservation) {
                throw new common_1.NotFoundException('Reservation not found');
            }
            if (reservation.status === client_1.OccupancyStatus.CANCELLED || reservation.status === client_1.OccupancyStatus.EXPIRED || reservation.status === client_1.OccupancyStatus.RELEASED) {
                throw new common_1.BadRequestException('Cannot reschedule an inactive reservation');
            }
            const overlap = await tx.spaceOccupancy.findFirst({
                where: {
                    tenantId,
                    spaceId: reservation.spaceId,
                    id: { not: id },
                    status: { in: [client_1.OccupancyStatus.HOLD, client_1.OccupancyStatus.RESERVED, client_1.OccupancyStatus.CONTRACTED] },
                    OR: [
                        {
                            startTime: { lt: newEndTime },
                            endTime: { gt: newStartTime },
                        },
                    ],
                },
            });
            if (overlap) {
                throw new common_1.ConflictException('Space is already booked for the new time slot');
            }
            return await tx.spaceOccupancy.update({
                where: { id },
                data: {
                    startTime: newStartTime,
                    endTime: newEndTime,
                },
            });
        }, {
            isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
        });
    }
    async release(id) {
        const tenantId = this.getTenantId();
        const reservation = await this.prisma.spaceOccupancy.findFirst({
            where: { id, tenantId },
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Reservation not found');
        }
        return await this.prisma.spaceOccupancy.update({
            where: { id },
            data: { status: client_1.OccupancyStatus.RELEASED },
        });
    }
    async cancel(id) {
        const tenantId = this.getTenantId();
        const reservation = await this.prisma.spaceOccupancy.findFirst({
            where: { id, tenantId },
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Reservation not found');
        }
        return await this.prisma.spaceOccupancy.update({
            where: { id },
            data: { status: client_1.OccupancyStatus.CANCELLED },
        });
    }
    async expire(id) {
        const tenantId = this.getTenantId();
        const reservation = await this.prisma.spaceOccupancy.findFirst({
            where: { id, tenantId },
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Reservation not found');
        }
        return await this.prisma.spaceOccupancy.update({
            where: { id },
            data: { status: client_1.OccupancyStatus.EXPIRED },
        });
    }
};
exports.AgendaService = AgendaService;
exports.AgendaService = AgendaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgendaService);
//# sourceMappingURL=agenda.service.js.map