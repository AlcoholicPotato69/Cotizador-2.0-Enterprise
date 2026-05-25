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
exports.SpacesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SpacesRepository = class SpacesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(tenantId, id) {
        return this.prisma.space.findFirst({
            where: { id, tenantId },
        });
    }
    async findByIdForUpdate(tx, tenantId, id) {
        const result = await tx.$queryRaw `
      SELECT * FROM "Space" 
      WHERE id = ${id}::uuid 
      AND tenant_id = ${tenantId}::uuid 
      FOR UPDATE
    `;
        if (!result || result.length === 0) {
            throw new common_1.NotFoundException('Space not found or access denied');
        }
        return result[0];
    }
    async create(data) {
        return this.prisma.space.create({ data });
    }
    async update(tenantId, id, data) {
        const space = await this.prisma.space.findFirst({ where: { id, tenantId } });
        if (!space) {
            throw new common_1.NotFoundException('Space not found or access denied');
        }
        return this.prisma.space.update({
            where: { id },
            data,
        });
    }
};
exports.SpacesRepository = SpacesRepository;
exports.SpacesRepository = SpacesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpacesRepository);
//# sourceMappingURL=spaces.repository.js.map