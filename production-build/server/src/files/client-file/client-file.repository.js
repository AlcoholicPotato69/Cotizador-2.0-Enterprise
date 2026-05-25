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
exports.ClientFileRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ClientFileRepository = class ClientFileRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createClientFile(data) {
        return this.prisma.clientFile.create({ data });
    }
    async findClientFiles(tenantId, clientId) {
        return this.prisma.clientFile.findMany({
            where: { tenantId, clientId, deletedAt: null },
            include: { documents: true },
        });
    }
    async findClientFileById(tenantId, id) {
        return this.prisma.clientFile.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: { documents: true },
        });
    }
    async addDocument(data) {
        return this.prisma.clientFileDocument.create({ data });
    }
    async findClientFileDocumentById(tenantId, id) {
        return this.prisma.clientFileDocument.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
    }
};
exports.ClientFileRepository = ClientFileRepository;
exports.ClientFileRepository = ClientFileRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientFileRepository);
//# sourceMappingURL=client-file.repository.js.map