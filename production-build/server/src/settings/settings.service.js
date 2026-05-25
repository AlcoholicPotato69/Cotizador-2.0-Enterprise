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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    globalSettings = { timezone: 'UTC', currency: 'USD', language: 'en' };
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveEffectiveSettings(tenantId) {
        const tenantSettings = await this.prisma.tenantSettings.findUnique({ where: { tenantId } });
        if (!tenantSettings) {
            return this.globalSettings;
        }
        return {
            ...this.globalSettings,
            timezone: tenantSettings.timezone,
            currency: tenantSettings.currency,
            language: tenantSettings.language
        };
    }
    async updateSettings(tenantId, updates) {
        const current = await this.resolveEffectiveSettings(tenantId);
        await this.prisma.settingsHistory.create({
            data: { tenantId, previousState: current, newState: updates }
        });
        return await this.prisma.tenantSettings.upsert({
            where: { tenantId },
            update: updates,
            create: { tenantId, ...updates, timezone: updates.timezone || this.globalSettings.timezone, currency: updates.currency || this.globalSettings.currency, language: updates.language || this.globalSettings.language }
        });
    }
    async rollbackSettings(tenantId, versionId) {
        const history = await this.prisma.settingsHistory.findUnique({ where: { id: versionId } });
        if (!history)
            throw new common_1.NotFoundException('Versión histórica no encontrada');
        const previousState = history.previousState;
        return this.updateSettings(tenantId, {
            timezone: previousState.timezone,
            currency: previousState.currency,
            language: previousState.language
        });
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map