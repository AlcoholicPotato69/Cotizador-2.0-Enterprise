import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        tenantId: string;
        role: string;
        email: string;
        permissions: string[];
    };
}
export declare class CatalogController {
    private readonly service;
    constructor(service: CatalogService);
    createItem(req: AuthenticatedRequest, dto: CreateCatalogItemDto): Promise<{
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
export {};
