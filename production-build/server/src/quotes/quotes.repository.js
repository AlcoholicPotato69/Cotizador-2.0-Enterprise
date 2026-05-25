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
exports.QuotesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuotesRepository = class QuotesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, tx) {
        const client = tx || this.prisma;
        return client.quote.create({ data });
    }
    async findByIdForUpdate(tx, tenantId, id) {
        const result = await tx.$queryRaw `
      SELECT * FROM "Quote" 
      WHERE id = ${id}::uuid 
      AND tenant_id = ${tenantId}::uuid 
      FOR UPDATE
    `;
        if (!result || result.length === 0) {
            throw new Error('Quote not found or access denied');
        }
        return result[0];
    }
    async findById(tenantId, id, tx) {
        const client = tx || this.prisma;
        return client.quote.findFirst({
            where: { id, tenantId },
        });
    }
    async findFirst(where) {
        return this.prisma.quote.findFirst({ where });
    }
    async findMany(where) {
        return this.prisma.quote.findMany({ where });
    }
    async update(tenantId, id, data, tx) {
        const exists = await this.findById(tenantId, id, tx);
        if (!exists)
            throw new Error('Quote not found or access denied');
        const client = tx || this.prisma;
        return client.quote.update({
            where: { id_tenantId: { id, tenantId } },
            data,
        });
    }
};
exports.QuotesRepository = QuotesRepository;
exports.QuotesRepository = QuotesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotesRepository);
//# sourceMappingURL=quotes.repository.js.map