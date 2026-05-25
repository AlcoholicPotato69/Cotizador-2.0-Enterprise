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
exports.RegulationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const regulation_events_1 = require("./events/regulation.events");
const tenant_context_1 = require("../prisma/tenant-context");
let RegulationsService = class RegulationsService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async createRegulation(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;
            const regulation = await tx.regulation.create({
                data: {
                    tenantId: ctx.tenantId,
                    title: dto.title,
                },
            });
            await tx.regulationVersion.create({
                data: {
                    tenantId: ctx.tenantId,
                    regulationId: regulation.id,
                    version: dto.version || '1.0.0',
                    content: dto.content,
                },
            });
            this.eventEmitter.emit('regulation.created', new regulation_events_1.RegulationCreatedEvent(ctx.tenantId, regulation.id));
            return regulation;
        });
    }
    async acceptRegulation(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.prisma.$transaction(async (tx) => {
            const regulation = await tx.regulation.findFirst({
                where: { id: dto.regulationId, tenantId: ctx.tenantId }
            });
            if (!regulation)
                throw new common_1.ConflictException('Regulation not found or access denied');
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;
            const acceptance = await tx.regulationAcceptance.create({
                data: {
                    tenantId: ctx.tenantId,
                    regulationId: dto.regulationId,
                    acceptedBy: dto.acceptedBy,
                    ipAddress: dto.ipAddress,
                    userAgent: dto.userAgent,
                    version: dto.version,
                },
            });
            this.eventEmitter.emit('regulation.accepted', new regulation_events_1.RegulationAcceptedEvent(ctx.tenantId, acceptance.id, dto.regulationId, dto.acceptedBy));
            return acceptance;
        });
    }
};
exports.RegulationsService = RegulationsService;
exports.RegulationsService = RegulationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], RegulationsService);
//# sourceMappingURL=regulations.service.js.map