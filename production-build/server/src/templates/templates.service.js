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
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const template_events_1 = require("./events/template.events");
const tenant_context_1 = require("../prisma/tenant-context");
let TemplatesService = class TemplatesService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async createTemplate(dto) {
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
            const template = await tx.contractTemplate.create({
                data: {
                    tenantId: ctx.tenantId,
                    name: dto.name,
                },
            });
            await tx.contractTemplateVersion.create({
                data: {
                    tenantId: ctx.tenantId,
                    contractTemplateId: template.id,
                    version: dto.version || '1.0.0',
                    content: dto.content,
                },
            });
            this.eventEmitter.emit('template.created', new template_events_1.TemplateCreatedEvent(ctx.tenantId, template.id));
            return template;
        });
    }
    async createClause(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.prisma.$transaction(async (tx) => {
            if (dto.templateId) {
                const template = await tx.contractTemplate.findFirst({
                    where: { id: dto.templateId, tenantId: ctx.tenantId }
                });
                if (!template)
                    throw new common_1.ConflictException('Template not found or access denied');
            }
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;
            const clause = await tx.contractClause.create({
                data: {
                    tenantId: ctx.tenantId,
                    title: dto.title,
                },
            });
            await tx.clauseVersion.create({
                data: {
                    tenantId: ctx.tenantId,
                    contractClauseId: clause.id,
                    version: '1.0.0',
                    content: dto.content,
                },
            });
            this.eventEmitter.emit('clause.created', new template_events_1.ClauseCreatedEvent(ctx.tenantId, clause.id, dto.templateId));
            return clause;
        });
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map