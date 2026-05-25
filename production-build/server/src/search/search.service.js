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
exports.GlobalSearchEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GlobalSearchEngineService = class GlobalSearchEngineService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async globalSearch(query, tenantId) {
        const results = await this.prisma.$queryRaw `
      SELECT 
        id, 
        "entity_type", 
        payload,
        ts_rank(
          to_tsvector('spanish', payload::text), 
          plainto_tsquery('spanish', ${query})
        ) AS "relevance"
      FROM "Snapshot"
      WHERE 
        "tenant_id" = ${tenantId} 
        AND to_tsvector('spanish', payload::text) @@ plainto_tsquery('spanish', ${query})
      ORDER BY "relevance" DESC
      LIMIT 50;
    `;
        return results;
    }
};
exports.GlobalSearchEngineService = GlobalSearchEngineService;
exports.GlobalSearchEngineService = GlobalSearchEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GlobalSearchEngineService);
//# sourceMappingURL=search.service.js.map