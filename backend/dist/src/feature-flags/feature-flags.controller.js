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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlagsController = void 0;
const common_1 = require("@nestjs/common");
const feature_flags_service_1 = require("./feature-flags.service");
const tenant_context_service_1 = require("../common/tenant-context.service");
let FeatureFlagsController = class FeatureFlagsController {
    featureFlagsService;
    tenantContext;
    constructor(featureFlagsService, tenantContext) {
        this.featureFlagsService = featureFlagsService;
        this.tenantContext = tenantContext;
    }
    create(body) {
        const tenantId = this.tenantContext.getTenantId();
        return this.featureFlagsService.create(tenantId, body.featureKey, body.enabled, body.rolloutPercentage);
    }
    async isEnabled(featureKey) {
        const tenantId = this.tenantContext.getTenantId();
        const enabled = await this.featureFlagsService.isEnabled(tenantId, featureKey);
        return { enabled };
    }
    toggle(featureKey, enabled) {
        const tenantId = this.tenantContext.getTenantId();
        return this.featureFlagsService.toggleFlag(tenantId, featureKey, enabled);
    }
};
exports.FeatureFlagsController = FeatureFlagsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FeatureFlagsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':featureKey/enabled'),
    __param(0, (0, common_1.Param)('featureKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeatureFlagsController.prototype, "isEnabled", null);
__decorate([
    (0, common_1.Patch)(':featureKey/toggle'),
    __param(0, (0, common_1.Param)('featureKey')),
    __param(1, (0, common_1.Body)('enabled')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], FeatureFlagsController.prototype, "toggle", null);
exports.FeatureFlagsController = FeatureFlagsController = __decorate([
    (0, common_1.Controller)('feature-flags'),
    __metadata("design:paramtypes", [feature_flags_service_1.FeatureFlagsService,
        tenant_context_service_1.TenantContextService])
], FeatureFlagsController);
//# sourceMappingURL=feature-flags.controller.js.map