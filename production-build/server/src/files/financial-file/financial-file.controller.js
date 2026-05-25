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
exports.FinancialFileController = void 0;
const common_1 = require("@nestjs/common");
const financial_file_service_1 = require("./financial-file.service");
const financial_file_dto_1 = require("./financial-file.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const tenant_isolation_guard_1 = require("../../auth/guards/tenant-isolation.guard");
const swagger_1 = require("@nestjs/swagger");
let FinancialFileController = class FinancialFileController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createFinancialFile(req, dto) {
        const tenantId = req.user.tenantId;
        return this.service.createFinancialFile(tenantId, dto);
    }
    async getFinancialFiles(req, invoiceId) {
        const tenantId = req.user.tenantId;
        return this.service.getFinancialFiles(tenantId, invoiceId);
    }
};
exports.FinancialFileController = FinancialFileController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('financial-files:write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, financial_file_dto_1.CreateFinancialFileDto]),
    __metadata("design:returntype", Promise)
], FinancialFileController.prototype, "createFinancialFile", null);
__decorate([
    (0, common_1.Get)('invoice/:invoiceId'),
    (0, permissions_decorator_1.Permissions)('financial-files:read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinancialFileController.prototype, "getFinancialFiles", null);
exports.FinancialFileController = FinancialFileController = __decorate([
    (0, swagger_1.ApiTags)('Financial File'),
    (0, common_1.Controller)('financial-files'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [financial_file_service_1.FinancialFileService])
], FinancialFileController);
//# sourceMappingURL=financial-file.controller.js.map