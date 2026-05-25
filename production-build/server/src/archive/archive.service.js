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
var ArchiveEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
let ArchiveEngineService = ArchiveEngineService_1 = class ArchiveEngineService {
    prisma;
    logger = new common_1.Logger(ArchiveEngineService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async archiveEntity(model, id, archivedBy) {
        this.logger.log(`Archiving ${model} with ID ${id} by ${archivedBy}`);
        const { tenantContext } = require('../prisma/tenant-context');
        const ctx = tenantContext.getStore();
        if (!ctx || !ctx.tenantId) {
            if (archivedBy !== 'SYSTEM_RETENTION_POLICY') {
                throw new Error('Tenant context required for archiving');
            }
        }
        const tenantId = ctx?.tenantId;
        const now = new Date();
        switch (model) {
            case 'Client':
                if (tenantId) {
                    const exists = await this.prisma.client.findFirst({ where: { id, tenantId } });
                    if (!exists)
                        throw new Error('Not found or access denied');
                }
                return this.prisma.client.update({
                    where: { id },
                    data: { status: 'ARCHIVED', deletedAt: now, deletedBy: archivedBy }
                });
            case 'Quote':
                if (tenantId) {
                    const exists = await this.prisma.quote.findFirst({ where: { id, tenantId } });
                    if (!exists)
                        throw new Error('Not found or access denied');
                }
                return this.prisma.quote.update({
                    where: { id },
                    data: { status: 'EXPIRED', deletedAt: now, deletedBy: archivedBy }
                });
            case 'Contract':
                if (tenantId) {
                    const exists = await this.prisma.contract.findFirst({ where: { id, tenantId } });
                    if (!exists)
                        throw new Error('Not found or access denied');
                }
                return this.prisma.contract.update({
                    where: { id },
                    data: { status: 'TERMINATED', deletedAt: now, deletedBy: archivedBy }
                });
            case 'Document':
                if (tenantId) {
                    const exists = await this.prisma.document.findFirst({ where: { id, tenantId } });
                    if (!exists)
                        throw new Error('Not found or access denied');
                }
                return this.prisma.document.update({
                    where: { id },
                    data: { deletedAt: now, deletedBy: archivedBy }
                });
            default:
                throw new Error(`Model ${model} not supported for archiving.`);
        }
    }
    async applyRetentionPolicies() {
        this.logger.log('Running retention policies...');
        const { tenantContext } = require('../prisma/tenant-context');
        const ctx = tenantContext?.getStore();
        const tenantId = ctx?.tenantId;
        const now = new Date();
        const whereClause = {
            retentionUntil: { lte: now },
            legalHold: false,
            deletedAt: null
        };
        if (tenantId) {
            whereClause.tenantId = tenantId;
        }
        const expiredDocuments = await this.prisma.document.findMany({
            where: whereClause
        });
        if (expiredDocuments.length > 0) {
            const ids = expiredDocuments.map(d => d.id);
            await this.prisma.document.updateMany({
                where: { id: { in: ids } },
                data: { deletedAt: now, deletedBy: 'SYSTEM_RETENTION_POLICY' }
            });
        }
        this.logger.log(`Archived ${expiredDocuments.length} expired documents.`);
    }
};
exports.ArchiveEngineService = ArchiveEngineService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArchiveEngineService.prototype, "applyRetentionPolicies", null);
exports.ArchiveEngineService = ArchiveEngineService = ArchiveEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArchiveEngineService);
//# sourceMappingURL=archive.service.js.map