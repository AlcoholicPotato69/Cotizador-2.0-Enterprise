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
exports.ContractFileRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ContractFileRepository = class ContractFileRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createContractFile(data) {
        return this.prisma.contractFile.create({ data });
    }
    async findContractFiles(tenantId, contractId) {
        return this.prisma.contractFile.findMany({
            where: { tenantId, contractId, deletedAt: null },
        });
    }
    async findContractFileById(tenantId, id) {
        return this.prisma.contractFile.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
    }
};
exports.ContractFileRepository = ContractFileRepository;
exports.ContractFileRepository = ContractFileRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractFileRepository);
//# sourceMappingURL=contract-file.repository.js.map