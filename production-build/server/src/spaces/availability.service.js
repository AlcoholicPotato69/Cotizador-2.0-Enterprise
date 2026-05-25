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
exports.AvailabilityEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const spaces_repository_1 = require("./spaces.repository");
const occupancy_repository_1 = require("./occupancy.repository");
const client_1 = require("@prisma/client");
const tenant_context_1 = require("../prisma/tenant-context");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
let AvailabilityEngineService = class AvailabilityEngineService {
    prisma;
    spacesRepo;
    occupancyRepo;
    eventPublisher;
    constructor(prisma, spacesRepo, occupancyRepo, eventPublisher) {
        this.prisma = prisma;
        this.spacesRepo = spacesRepo;
        this.occupancyRepo = occupancyRepo;
        this.eventPublisher = eventPublisher;
    }
    async reserveSpace(request, sourceId, sourceType) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context is missing');
        if (request.startTime >= request.endTime) {
            throw new common_1.ConflictException('Start time must be before end time');
        }
        return await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;
            const space = await this.spacesRepo.findByIdForUpdate(tx, ctx.tenantId, request.spaceId);
            const blockedDays = Array.isArray(space.diasBloqueados) ? space.diasBloqueados : [];
            const overlaps = await this.occupancyRepo.findOverlapping(tx, ctx.tenantId, request.spaceId, request.startTime, request.endTime);
            if (overlaps) {
                throw new common_1.ConflictException('Concurrency conflict: Space was reserved by another transaction.');
            }
            const occupancy = await this.occupancyRepo.create(tx, {
                tenantId: ctx.tenantId,
                spaceId: request.spaceId,
                startTime: request.startTime,
                endTime: request.endTime,
                status: client_1.OccupancyStatus.HOLD,
                occupancySourceId: sourceId,
                occupancySourceType: sourceType,
            });
            return occupancy.id;
        });
    }
};
exports.AvailabilityEngineService = AvailabilityEngineService;
exports.AvailabilityEngineService = AvailabilityEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        spaces_repository_1.SpacesRepository,
        occupancy_repository_1.OccupancyRepository,
        domain_event_publisher_1.DomainEventPublisher])
], AvailabilityEngineService);
//# sourceMappingURL=availability.service.js.map