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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const clients_repository_1 = require("./clients.repository");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const tenant_context_1 = require("../prisma/tenant-context");
let ClientsService = class ClientsService {
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
        const client = await this.repo.create({
            ...data,
            tenant: { connect: { id: ctx.tenantId } }
        });
        await this.eventPublisher.publish({
            eventName: 'client.created',
            tenantId: ctx.tenantId,
            payload: { clientId: client.id },
            timestamp: new Date()
        });
        return client;
    }
    async findById(id) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.NotFoundException('Tenant context missing');
        return this.repo.findById(id, ctx.tenantId);
    }
    async update(id, data) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.NotFoundException('Tenant context missing');
        if ('tenantId' in data)
            delete data.tenantId;
        if ('tenant' in data)
            delete data.tenant;
        const updated = await this.repo.update(id, ctx.tenantId, data);
        await this.eventPublisher.publish({
            eventName: 'client.updated',
            tenantId: ctx.tenantId,
            payload: { clientId: updated.id },
            timestamp: new Date()
        });
        return updated;
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_repository_1.ClientsRepository,
        domain_event_publisher_1.DomainEventPublisher])
], ClientsService);
//# sourceMappingURL=clients.service.js.map