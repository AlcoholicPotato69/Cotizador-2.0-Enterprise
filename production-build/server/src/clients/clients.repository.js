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
exports.ClientsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClientsRepository = class ClientsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.client.create({ data });
    }
    async findById(id, tenantId) {
        const whereClause = { id };
        if (tenantId) {
            whereClause.tenantId = tenantId;
        }
        return this.prisma.client.findFirst({
            where: whereClause,
        });
    }
    async findFirst(where) {
        return this.prisma.client.findFirst({ where });
    }
    async update(id, tenantId, data) {
        const client = await this.prisma.client.findFirst({ where: { id, tenantId } });
        if (!client) {
            throw new common_1.NotFoundException('Client not found or access denied');
        }
        return this.prisma.client.update({
            where: { id },
            data,
        });
    }
    async softDelete(tenantId, id, deletedBy) {
        const exists = await this.findFirst({ id, tenantId });
        if (!exists)
            throw new Error('Client not found or access denied');
        return this.prisma.client.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy,
            },
        });
    }
};
exports.ClientsRepository = ClientsRepository;
exports.ClientsRepository = ClientsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsRepository);
//# sourceMappingURL=clients.repository.js.map