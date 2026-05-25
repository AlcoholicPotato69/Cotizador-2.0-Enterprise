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
exports.ArchiveController = void 0;
const common_1 = require("@nestjs/common");
const archive_service_1 = require("./archive.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../rbac/guards/permissions.guard");
const permissions_decorator_1 = require("../rbac/decorators/permissions.decorator");
const tenant_isolation_guard_1 = require("../auth/guards/tenant-isolation.guard");
const permissions_decorator_2 = require("../auth/decorators/permissions.decorator");
const swagger_1 = require("@nestjs/swagger");
let ArchiveController = class ArchiveController {
    archiveService;
    constructor(archiveService) {
        this.archiveService = archiveService;
    }
    async archiveEntity(model, id, req) {
        const archivedBy = req.user?.id || 'admin';
        return this.archiveService.archiveEntity(model, id, archivedBy);
    }
    async simulateRetention() {
        await this.archiveService.applyRetentionPolicies();
        return { success: true };
    }
};
exports.ArchiveController = ArchiveController;
__decorate([
    (0, common_1.Post)('entity/:model/:id'),
    (0, permissions_decorator_1.RequirePermissions)('write:archive'),
    (0, permissions_decorator_2.Permissions)('archive:read'),
    __param(0, (0, common_1.Param)('model')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ArchiveController.prototype, "archiveEntity", null);
__decorate([
    (0, common_1.Post)('simulate-retention'),
    (0, permissions_decorator_1.RequirePermissions)('write:archive'),
    (0, permissions_decorator_2.Permissions)('archive:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArchiveController.prototype, "simulateRetention", null);
exports.ArchiveController = ArchiveController = __decorate([
    (0, swagger_1.ApiTags)('Archive'),
    (0, common_1.Controller)('archive'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [archive_service_1.ArchiveEngineService])
], ArchiveController);
//# sourceMappingURL=archive.controller.js.map