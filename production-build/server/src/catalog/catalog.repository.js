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
exports.CatalogRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CatalogRepository = class CatalogRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategory(data) {
        return this.prisma.catalogCategory.create({ data });
    }
    async findCategoryById(id, tenantId) {
        return this.prisma.catalogCategory.findFirst({ where: { id, tenantId } });
    }
    async createItem(data, tx) {
        const db = tx || this.prisma;
        return db.catalogItem.create({ data });
    }
    async createPrice(data, tx) {
        const db = tx || this.prisma;
        return db.catalogPrice.create({ data });
    }
    getPrisma() {
        return this.prisma;
    }
};
exports.CatalogRepository = CatalogRepository;
exports.CatalogRepository = CatalogRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogRepository);
//# sourceMappingURL=catalog.repository.js.map