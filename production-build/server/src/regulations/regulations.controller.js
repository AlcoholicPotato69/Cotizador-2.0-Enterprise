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
exports.RegulationsController = void 0;
const common_1 = require("@nestjs/common");
const regulations_service_1 = require("./regulations.service");
const create_regulation_dto_1 = require("./dto/create-regulation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const tenant_context_1 = require("../prisma/tenant-context");
const tenant_isolation_guard_1 = require("../auth/guards/tenant-isolation.guard");
const swagger_1 = require("@nestjs/swagger");
let RegulationsController = class RegulationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createRegulation(req, dto) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, () => this.service.createRegulation(dto));
    }
    async acceptRegulation(req, dto) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, () => this.service.acceptRegulation(dto));
    }
};
exports.RegulationsController = RegulationsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('regulations:write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_regulation_dto_1.CreateRegulationDto]),
    __metadata("design:returntype", Promise)
], RegulationsController.prototype, "createRegulation", null);
__decorate([
    (0, common_1.Post)('accept'),
    (0, permissions_decorator_1.Permissions)('regulations:accept'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_regulation_dto_1.AcceptRegulationDto]),
    __metadata("design:returntype", Promise)
], RegulationsController.prototype, "acceptRegulation", null);
exports.RegulationsController = RegulationsController = __decorate([
    (0, swagger_1.ApiTags)('Regulations'),
    (0, common_1.Controller)('regulations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [regulations_service_1.RegulationsService])
], RegulationsController);
//# sourceMappingURL=regulations.controller.js.map