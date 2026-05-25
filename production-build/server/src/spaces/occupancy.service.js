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
exports.OccupancyService = void 0;
const common_1 = require("@nestjs/common");
const occupancy_repository_1 = require("./occupancy.repository");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const tenant_context_1 = require("../prisma/tenant-context");
const prisma_service_1 = require("../prisma/prisma.service");
let OccupancyService = class OccupancyService {
    repo;
    prisma;
    eventPublisher;
    constructor(repo, prisma, eventPublisher) {
        this.repo = repo;
        this.prisma = prisma;
        this.eventPublisher = eventPublisher;
    }
    async createOccupancy(data) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.NotFoundException('Tenant context missing');
        return await this.prisma.$transaction(async (tx) => {
            const overlapping = await this.repo.findOverlapping(tx, ctx.tenantId, data.spaceId, new Date(data.startTime), new Date(data.endTime));
            if (overlapping) {
                throw new common_1.ConflictException('Space is already occupied during this time');
            }
            const occupancy = await this.repo.create(tx, {
                ...data,
                tenantId: ctx.tenantId,
            });
            await this.eventPublisher.publish({
                eventName: 'occupancy.created',
                tenantId: ctx.tenantId,
                payload: { occupancyId: occupancy.id, spaceId: occupancy.spaceId },
                timestamp: new Date()
            });
            return occupancy;
        });
    }
};
exports.OccupancyService = OccupancyService;
exports.OccupancyService = OccupancyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [occupancy_repository_1.OccupancyRepository,
        prisma_service_1.PrismaService,
        domain_event_publisher_1.DomainEventPublisher])
], OccupancyService);
//# sourceMappingURL=occupancy.service.js.map