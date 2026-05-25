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
exports.NumberingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NumberingService = class NumberingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateFolio(dto) {
        const { tenantId, entityType, prefix = '', suffix = '', step = 1 } = dto;
        const sequence = await this.prisma.numberingSequence.upsert({
            where: {
                tenantId_entityType: {
                    tenantId,
                    entityType,
                },
            },
            update: {
                currentValue: {
                    increment: step,
                },
            },
            create: {
                tenantId,
                entityType,
                prefix,
                suffix,
                currentValue: step,
                step,
            },
        });
        const paddedValue = sequence.currentValue.toString().padStart(6, '0');
        const actualPrefix = sequence.prefix || prefix;
        const actualSuffix = sequence.suffix || suffix;
        let folio = paddedValue;
        if (actualPrefix)
            folio = `${actualPrefix}-${folio}`;
        if (actualSuffix)
            folio = `${folio}-${actualSuffix}`;
        return folio;
    }
};
exports.NumberingService = NumberingService;
exports.NumberingService = NumberingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NumberingService);
//# sourceMappingURL=numbering.service.js.map