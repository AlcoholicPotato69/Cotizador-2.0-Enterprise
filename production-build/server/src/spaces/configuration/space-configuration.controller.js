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
exports.SpaceConfigurationController = void 0;
const common_1 = require("@nestjs/common");
const space_configuration_service_1 = require("./space-configuration.service");
const create_configuration_dto_1 = require("./dto/create-configuration.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const tenant_context_1 = require("../../prisma/tenant-context");
const tenant_isolation_guard_1 = require("../../auth/guards/tenant-isolation.guard");
const swagger_1 = require("@nestjs/swagger");
let SpaceConfigurationController = class SpaceConfigurationController {
    service;
    constructor(service) {
        this.service = service;
    }
    async setConfiguration(req, dto) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, () => this.service.setConfiguration(dto));
    }
    async createRule(req, dto) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, () => this.service.createRule(dto));
    }
};
exports.SpaceConfigurationController = SpaceConfigurationController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('spaces:config:write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_configuration_dto_1.CreateSpaceConfigurationDto]),
    __metadata("design:returntype", Promise)
], SpaceConfigurationController.prototype, "setConfiguration", null);
__decorate([
    (0, common_1.Post)('rules'),
    (0, permissions_decorator_1.Permissions)('spaces:rules:write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_configuration_dto_1.CreateSpaceRuleDto]),
    __metadata("design:returntype", Promise)
], SpaceConfigurationController.prototype, "createRule", null);
exports.SpaceConfigurationController = SpaceConfigurationController = __decorate([
    (0, swagger_1.ApiTags)('Space Configuration'),
    (0, common_1.Controller)('space-configuration'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [space_configuration_service_1.SpaceConfigurationService])
], SpaceConfigurationController);
//# sourceMappingURL=space-configuration.controller.js.map