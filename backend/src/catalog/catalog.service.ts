import { Injectable, ConflictException } from '@nestjs/common';
import { CatalogRepository } from './catalog.repository';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';

@Injectable()
export class CatalogService {
  constructor(
    private readonly repo: CatalogRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async createItem(dto: CreateCatalogItemDto) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.repo.getPrisma().$transaction(async (tx) => {
      if (dto.categoryId && dto.categoryId !== 'default-category') {
        const category = await tx.catalogCategory.findFirst({
          where: { id: dto.categoryId, tenantId: ctx.tenantId },
        });
        if (!category)
          throw new ConflictException('Category not found or access denied');
      }

      // Removing Live Read of tx.space.findFirst to adhere to Zero Live Reads across domains.

      // 1. Set tenant context in DB
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      // 2. Create Item
      const item = await this.repo.createItem(
        {
          tenantId: ctx.tenantId,
          name: dto.name,
          sku: dto.sku,
          description: dto.description,
          categoryId: dto.categoryId || 'default-category',
          spaceCode: dto.spaceCode,
        },
        tx,
      );

      // 3. Create Price
      await this.repo.createPrice(
        {
          tenantId: ctx.tenantId,
          catalogItemId: item.id,
          amount: dto.basePrice,
          currencyCode: 'USD',
          validFrom: new Date(),
        },
        tx,
      );

      // 4. Emit Domain Event using DomainEventPublisher
      await this.eventPublisher.publish({
        eventName: 'catalog.item.created',
        tenantId: ctx.tenantId,
        payload: { itemId: item.id, sku: item.sku },
        timestamp: new Date(),
      });

      return item;
    });
  }
}
