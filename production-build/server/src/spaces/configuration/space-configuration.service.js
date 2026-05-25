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
exports.SpaceConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const space_configuration_events_1 = require("./events/space-configuration.events");
const tenant_context_1 = require("../../prisma/tenant-context");
let SpaceConfigurationService = class SpaceConfigurationService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async setConfiguration(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.prisma.$transaction(async (tx) => {
            const space = await tx.space.findFirst({
                where: { id: dto.spaceId, tenantId: ctx.tenantId }
            });
            if (!space)
                throw new common_1.ConflictException('Space not found or access denied');
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;
            const config = await tx.spaceConfiguration.create({
                data: {
                    tenantId: ctx.tenantId,
                    spaceId: dto.spaceId,
                    configKey: dto.configKey,
                    configValue: dto.configValue,
                },
            });
            this.eventEmitter.emit('space.configuration.updated', new space_configuration_events_1.SpaceConfigurationUpdatedEvent(ctx.tenantId, dto.spaceId, dto.configKey));
            return config;
        });
    }
    async createRule(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.prisma.$transaction(async (tx) => {
            const space = await tx.space.findFirst({
                where: { id: dto.spaceId, tenantId: ctx.tenantId }
            });
            if (!space)
                throw new common_1.ConflictException('Space not found or access denied');
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;
            const rule = await tx.spaceRule.create({
                data: {
                    tenantId: ctx.tenantId,
                    spaceId: dto.spaceId,
                    ruleType: dto.ruleType,
                    ruleDetails: dto.ruleDetails,
                },
            });
            this.eventEmitter.emit('space.rule.created', new space_configuration_events_1.SpaceRuleCreatedEvent(ctx.tenantId, dto.spaceId, rule.id, dto.ruleType));
            return rule;
        });
    }
};
exports.SpaceConfigurationService = SpaceConfigurationService;
exports.SpaceConfigurationService = SpaceConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], SpaceConfigurationService);
//# sourceMappingURL=space-configuration.service.js.map