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
exports.DocumentViewerController = void 0;
const common_1 = require("@nestjs/common");
const document_viewer_service_1 = require("./document-viewer.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const tenant_isolation_guard_1 = require("../../auth/guards/tenant-isolation.guard");
const swagger_1 = require("@nestjs/swagger");
let DocumentViewerController = class DocumentViewerController {
    service;
    constructor(service) {
        this.service = service;
    }
    generateSignedUrl(req, entityType, fileId, expiresInMinutes) {
        const tenantId = req.user.tenantId;
        const url = this.service.generateSignedUrl(tenantId, entityType, fileId, expiresInMinutes ? Number(expiresInMinutes) : 60);
        return { url };
    }
    async viewDocument(req, tenantId, entityType, fileId, expiresAt, signature, res) {
        if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'SYSTEM' && req.user.tenantId !== tenantId) {
            return res.status(403).send('Forbidden: Cannot access documents from another tenant');
        }
        const document = await this.service.viewDocument(tenantId, entityType, fileId, Number(expiresAt), signature);
        res.setHeader('Content-Disposition', `inline; filename="document-${fileId}.pdf"`);
        return res.redirect(document.url);
    }
};
exports.DocumentViewerController = DocumentViewerController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Get)('generate-url'),
    (0, permissions_decorator_1.Permissions)('documents:share'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('entityType')),
    __param(2, (0, common_1.Query)('fileId')),
    __param(3, (0, common_1.Query)('expiresInMinutes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number]),
    __metadata("design:returntype", void 0)
], DocumentViewerController.prototype, "generateSignedUrl", null);
__decorate([
    (0, common_1.Get)('view'),
    (0, permissions_decorator_1.Permissions)('files:read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('tenantId')),
    __param(2, (0, common_1.Query)('entityType')),
    __param(3, (0, common_1.Query)('fileId')),
    __param(4, (0, common_1.Query)('expiresAt')),
    __param(5, (0, common_1.Query)('signature')),
    __param(6, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentViewerController.prototype, "viewDocument", null);
exports.DocumentViewerController = DocumentViewerController = __decorate([
    (0, swagger_1.ApiTags)('Document Viewer'),
    (0, common_1.Controller)('document-viewer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [document_viewer_service_1.DocumentViewerService])
], DocumentViewerController);
//# sourceMappingURL=document-viewer.controller.js.map