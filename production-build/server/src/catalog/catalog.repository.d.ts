import { PrismaService } from '../prisma/prisma.service';
import { Prisma, CatalogItem, CatalogCategory, CatalogPrice } from '@prisma/client';
export declare class CatalogRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCategory(data: Prisma.CatalogCategoryUncheckedCreateInput): Promise<CatalogCategory>;
    findCategoryById(id: string, tenantId: string): Promise<CatalogCategory | null>;
    createItem(data: Prisma.CatalogItemUncheckedCreateInput, tx?: Prisma.TransactionClient): Promise<CatalogItem>;
    createPrice(data: Prisma.CatalogPriceUncheckedCreateInput, tx?: Prisma.TransactionClient): Promise<CatalogPrice>;
    getPrisma(): PrismaService;
}
