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
exports.SpacesService = void 0;
const common_1 = require("@nestjs/common");
const spaces_repository_1 = require("./spaces.repository");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const tenant_context_1 = require("../prisma/tenant-context");
let SpacesService = class SpacesService {
    repo;
    eventPublisher;
    constructor(repo, eventPublisher) {
        this.repo = repo;
        this.eventPublisher = eventPublisher;
    }
    async create(data) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.NotFoundException('Tenant context missing');
        const typeLower = data.spaceType.toLowerCase();
        const pmAllowed = ['publicidad física', 'publicidad digital', 'publicidad fisica'];
        const cpAllowed = ['salones', 'espacios', 'publicidad física', 'publicidad digital', 'publicidad fisica'];
        if (ctx.tenantId === 'pm' && !pmAllowed.includes(typeLower)) {
            throw new Error('Plaza Mayor solo puede crear espacios de tipo Publicidad Física o Digital.');
        }
        if (ctx.tenantId === 'cp' && !cpAllowed.includes(typeLower)) {
            throw new Error('Casa de Piedra solo puede crear Salones, Espacios o Publicidad.');
        }
        if (!data.planoPdf) {
            throw new Error('Todo espacio requiere un plano_pdf.');
        }
        if (!data.regulationTemplate) {
            throw new Error('Todo espacio requiere un reglamento.');
        }
        const space = await this.repo.create({
            ...data,
            tenantId: ctx.tenantId,
            configB2b: data.configB2b ?? {},
            preciosPorDia: data.preciosPorDia ?? {},
            diasBloqueados: data.diasBloqueados ?? {}
        });
        await this.eventPublisher.publish({
            eventName: 'space.created',
            tenantId: ctx.tenantId,
            payload: { spaceId: space.id },
            timestamp: new Date()
        });
        return space;
    }
    async findById(id) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.NotFoundException('Tenant context missing');
        return this.repo.findById(ctx.tenantId, id);
    }
    async update(id, data) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.NotFoundException('Tenant context missing');
        if (data.spaceType) {
            const typeLower = data.spaceType.toLowerCase();
            const pmAllowed = ['publicidad física', 'publicidad digital', 'publicidad fisica'];
            const cpAllowed = ['salones', 'espacios', 'publicidad física', 'publicidad digital', 'publicidad fisica'];
            if (ctx.tenantId === 'pm' && !pmAllowed.includes(typeLower)) {
                throw new Error('Plaza Mayor solo puede crear espacios de tipo Publicidad Física o Digital.');
            }
            if (ctx.tenantId === 'cp' && !cpAllowed.includes(typeLower)) {
                throw new Error('Casa de Piedra solo puede crear Salones, Espacios o Publicidad.');
            }
        }
        if (data.planoPdf !== undefined && !data.planoPdf) {
            throw new Error('Todo espacio requiere un plano_pdf.');
        }
        if (data.regulationTemplate !== undefined && !data.regulationTemplate) {
            throw new Error('Todo espacio requiere un reglamento.');
        }
        const updated = await this.repo.update(ctx.tenantId, id, data);
        await this.eventPublisher.publish({
            eventName: 'space.updated',
            tenantId: ctx.tenantId,
            payload: { spaceId: updated.id },
            timestamp: new Date()
        });
        return updated;
    }
};
exports.SpacesService = SpacesService;
exports.SpacesService = SpacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [spaces_repository_1.SpacesRepository,
        domain_event_publisher_1.DomainEventPublisher])
], SpacesService);
//# sourceMappingURL=spaces.service.js.map