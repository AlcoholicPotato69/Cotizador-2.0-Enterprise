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
exports.AgreementsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AgreementsRepository = class AgreementsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.agreement.create({ data });
    }
    async findManyByTenant(tenantId, filters) {
        return this.prisma.agreement.findMany({
            where: {
                tenantId,
                deletedAt: null,
                ...(filters?.clientId && { clientId: filters.clientId }),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.type && { type: filters.type }),
            },
            include: {
                items: true,
                versions: { orderBy: { versionNumber: 'desc' }, take: 1 },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(tenantId, id) {
        const agreement = await this.prisma.agreement.findFirst({
            where: {
                id, tenantId, deletedAt: null
            },
            include: {
                items: true,
                versions: { orderBy: { versionNumber: 'desc' } },
                approvals: { orderBy: { createdAt: 'desc' } },
                signatures: true,
                evidences: true,
                snapshots: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
        });
        if (!agreement) {
            throw new common_1.NotFoundException(`Agreement ${id} not found in tenant ${tenantId}`);
        }
        return agreement;
    }
    async update(tenantId, id, data) {
        return this.prisma.agreement.update({
            where: { id, tenantId },
            data,
        });
    }
    async addItems(tenantId, agreementId, items) {
        return this.prisma.agreementItem.createMany({
            data: items.map((item) => ({
                tenantId,
                agreementId,
                description: item.description,
            })),
        });
    }
    async createVersion(data) {
        return this.prisma.agreementVersion.create({ data });
    }
    async getLatestVersion(tenantId, agreementId) {
        return this.prisma.agreementVersion.findFirst({
            where: { tenantId, agreementId },
            orderBy: { versionNumber: 'desc' },
        });
    }
    async createApproval(data) {
        return this.prisma.agreementApproval.create({ data });
    }
    async createSignature(data) {
        return this.prisma.agreementSignature.create({ data });
    }
    async createEvidence(data) {
        return this.prisma.agreementEvidence.create({ data });
    }
    async createSnapshot(data) {
        return this.prisma.agreementSnapshot.create({ data });
    }
};
exports.AgreementsRepository = AgreementsRepository;
exports.AgreementsRepository = AgreementsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgreementsRepository);
//# sourceMappingURL=agreements.repository.js.map