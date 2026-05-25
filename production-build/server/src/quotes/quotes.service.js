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
exports.QuotesService = void 0;
const common_1 = require("@nestjs/common");
const quotes_repository_1 = require("./quotes.repository");
const client_1 = require("@prisma/client");
const fsm_validator_1 = require("../common/fsm.validator");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const tenant_context_1 = require("../prisma/tenant-context");
let QuotesService = class QuotesService {
    repo;
    fsmValidator;
    eventPublisher;
    constructor(repo, fsmValidator, eventPublisher) {
        this.repo = repo;
        this.fsmValidator = fsmValidator;
        this.eventPublisher = eventPublisher;
    }
    async create(data) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.NotFoundException('Tenant context missing');
        return await this.repo['prisma'].$transaction(async (tx) => {
            const quote = await this.repo.create({
                ...data,
                tenantId: ctx.tenantId,
                status: client_1.QuoteStatus.DRAFT,
                desglosePrecios: data.desglosePrecios ? data.desglosePrecios : client_1.Prisma.JsonNull,
            }, tx);
            await this.eventPublisher.publish({
                eventName: 'quote.created',
                tenantId: ctx.tenantId,
                payload: { quoteId: quote.id },
                timestamp: new Date()
            });
            return quote;
        });
    }
    async updateStatus(id, targetStatus) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.NotFoundException('Tenant context missing');
        return await this.repo['prisma'].$transaction(async (tx) => {
            const quote = await this.repo.findByIdForUpdate(tx, ctx.tenantId, id);
            if (!quote)
                throw new common_1.NotFoundException('Quote not found');
            this.fsmValidator.validateTransition('Quote', quote.status, targetStatus);
            const updated = await this.repo.update(ctx.tenantId, id, { status: targetStatus }, tx);
            await this.eventPublisher.publish({
                eventName: 'quote.status_updated',
                tenantId: ctx.tenantId,
                payload: { quoteId: quote.id, clientId: quote.clientId, currencyCode: quote.currencyCode, oldStatus: quote.status, newStatus: targetStatus },
                timestamp: new Date()
            });
            return updated;
        });
    }
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [quotes_repository_1.QuotesRepository,
        fsm_validator_1.FsmValidator,
        domain_event_publisher_1.DomainEventPublisher])
], QuotesService);
//# sourceMappingURL=quotes.service.js.map