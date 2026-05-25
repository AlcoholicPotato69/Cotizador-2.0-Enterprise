import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  CatalogItem,
  CatalogCategory,
  CatalogPrice,
} from '@prisma/client';

@Injectable()
export class CatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(
    data: Prisma.CatalogCategoryUncheckedCreateInput,
  ): Promise<CatalogCategory> {
    return this.prisma.catalogCategory.create({ data });
  }

  async findCategoryById(
    id: string,
    tenantId: string,
  ): Promise<CatalogCategory | null> {
    return this.prisma.catalogCategory.findFirst({ where: { id, tenantId } });
  }

  async createItem(
    data: Prisma.CatalogItemUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<CatalogItem> {
    const db = tx || this.prisma;
    return db.catalogItem.create({ data });
  }

  async createPrice(
    data: Prisma.CatalogPriceUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<CatalogPrice> {
    const db = tx || this.prisma;
    return db.catalogPrice.create({ data });
  }

  getPrisma() {
    return this.prisma;
  }
}
