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
exports.AgreementsController = void 0;
const common_1 = require("@nestjs/common");
const agreements_service_1 = require("./agreements.service");
const create_agreement_dto_1 = require("./dto/create-agreement.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const tenant_isolation_guard_1 = require("../auth/guards/tenant-isolation.guard");
const swagger_1 = require("@nestjs/swagger");
let AgreementsController = class AgreementsController {
    agreementsService;
    constructor(agreementsService) {
        this.agreementsService = agreementsService;
    }
    async create(user, dto) {
        return this.agreementsService.create(user.tenantId, dto, user.id);
    }
    async submitForReview(user, id) {
        return this.agreementsService.submitForReview(user.tenantId, id, user.id);
    }
    async approve(user, id) {
        return this.agreementsService.approve(user.tenantId, id, user.id);
    }
    async generateLetter(user, id, versionId) {
        return this.agreementsService.generateLetter(user.tenantId, id, versionId);
    }
    async pendingSignature(user, id) {
        return this.agreementsService.pendingSignature(user.tenantId, id);
    }
    async markAsSigned(user, id, signatureId) {
        return this.agreementsService.markAsSigned(user.tenantId, id, signatureId);
    }
};
exports.AgreementsController = AgreementsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('agreements:create'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_agreement_dto_1.CreateAgreementDto]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/submit-review'),
    (0, permissions_decorator_1.Permissions)('agreements:write'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "submitForReview", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('agreements:approve'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':id/generate-letter'),
    (0, permissions_decorator_1.Permissions)('agreements:write'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "generateLetter", null);
__decorate([
    (0, common_1.Put)(':id/pending-signature'),
    (0, permissions_decorator_1.Permissions)('agreements:write'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "pendingSignature", null);
__decorate([
    (0, common_1.Put)(':id/sign'),
    (0, permissions_decorator_1.Permissions)('agreements:write'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('signatureId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "markAsSigned", null);
exports.AgreementsController = AgreementsController = __decorate([
    (0, swagger_1.ApiTags)('Agreements'),
    (0, common_1.Controller)('agreements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [agreements_service_1.AgreementsService])
], AgreementsController);
//# sourceMappingURL=agreements.controller.js.map