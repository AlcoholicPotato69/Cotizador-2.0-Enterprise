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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const catalog_repository_1 = require("./catalog.repository");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const tenant_context_1 = require("../prisma/tenant-context");
let CatalogService = class CatalogService {
    repo;
    eventPublisher;
    constructor(repo, eventPublisher) {
        this.repo = repo;
        this.eventPublisher = eventPublisher;
    }
    async createItem(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.repo.getPrisma().$transaction(async (tx) => {
            if (dto.categoryId && dto.categoryId !== 'default-category') {
                const category = await tx.catalogCategory.findFirst({
                    where: { id: dto.categoryId, tenantId: ctx.tenantId }
                });
                if (!category)
                    throw new common_1.ConflictException('Category not found or access denied');
            }
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;
            const item = await this.repo.createItem({
                tenantId: ctx.tenantId,
                name: dto.name,
                sku: dto.sku,
                description: dto.description,
                categoryId: dto.categoryId || 'default-category',
                spaceCode: dto.spaceCode,
            }, tx);
            await this.repo.createPrice({
                tenantId: ctx.tenantId,
                catalogItemId: item.id,
                amount: dto.basePrice,
                currencyCode: 'USD',
                validFrom: new Date(),
            }, tx);
            await this.eventPublisher.publish({
                eventName: 'catalog.item.created',
                tenantId: ctx.tenantId,
                payload: { itemId: item.id, sku: item.sku },
                timestamp: new Date()
            });
            return item;
        });
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [catalog_repository_1.CatalogRepository,
        domain_event_publisher_1.DomainEventPublisher])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map