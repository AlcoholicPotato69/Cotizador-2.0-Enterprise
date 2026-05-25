import { CatalogRepository } from './catalog.repository';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
export declare class CatalogService {
    private readonly repo;
    private readonly eventPublisher;
    constructor(repo: CatalogRepository, eventPublisher: DomainEventPublisher);
    createItem(dto: CreateCatalogItemDto): Promise<{
        id: string;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
        description: string | null;
        categoryId: string;
        sku: string | null;
        spaceCode: string | null;
        locationPlanDocumentId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
