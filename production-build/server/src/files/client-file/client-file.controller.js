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
exports.ClientFileController = void 0;
const common_1 = require("@nestjs/common");
const client_file_service_1 = require("./client-file.service");
const client_file_dto_1 = require("./client-file.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const tenant_isolation_guard_1 = require("../../auth/guards/tenant-isolation.guard");
const swagger_1 = require("@nestjs/swagger");
let ClientFileController = class ClientFileController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createClientFile(req, dto) {
        const tenantId = req.user.tenantId;
        return this.service.createClientFile(tenantId, dto);
    }
    async getClientFiles(req, clientId) {
        const tenantId = req.user.tenantId;
        return this.service.getClientFiles(tenantId, clientId);
    }
    async addDocument(req, id, dto) {
        const tenantId = req.user.tenantId;
        return this.service.addDocument(tenantId, id, dto);
    }
};
exports.ClientFileController = ClientFileController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('client-files:write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, client_file_dto_1.CreateClientFileDto]),
    __metadata("design:returntype", Promise)
], ClientFileController.prototype, "createClientFile", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, permissions_decorator_1.Permissions)('client-files:read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClientFileController.prototype, "getClientFiles", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, permissions_decorator_1.Permissions)('client-files:write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, client_file_dto_1.AddClientFileDocumentDto]),
    __metadata("design:returntype", Promise)
], ClientFileController.prototype, "addDocument", null);
exports.ClientFileController = ClientFileController = __decorate([
    (0, swagger_1.ApiTags)('Client File'),
    (0, common_1.Controller)('client-files'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [client_file_service_1.ClientFileService])
], ClientFileController);
//# sourceMappingURL=client-file.controller.js.map