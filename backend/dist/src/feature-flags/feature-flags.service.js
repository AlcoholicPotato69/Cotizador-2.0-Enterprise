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
exports.FeatureFlagsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FeatureFlagsService = class FeatureFlagsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, featureKey, enabled = false, rolloutPercentage = 100) {
        return this.prisma.featureFlag.create({
            data: {
                tenantId,
                featureKey,
                enabled,
                rolloutPercentage,
            },
        });
    }
    async isEnabled(tenantId, featureKey) {
        const flag = await this.prisma.featureFlag.findFirst({
            where: { tenantId, featureKey },
        });
        if (!flag)
            return false;
        if (!flag.enabled)
            return false;
        const random = Math.floor(Math.random() * 100) + 1;
        return random <= flag.rolloutPercentage;
    }
    async toggleFlag(tenantId, featureKey, enabled) {
        const flag = await this.prisma.featureFlag.findFirst({
            where: { tenantId, featureKey },
        });
        if (!flag)
            throw new common_1.NotFoundException('Feature flag not found');
        return this.prisma.featureFlag.update({
            where: { id: flag.id },
            data: { enabled },
        });
    }
};
exports.FeatureFlagsService = FeatureFlagsService;
exports.FeatureFlagsService = FeatureFlagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeatureFlagsService);
//# sourceMappingURL=feature-flags.service.js.map