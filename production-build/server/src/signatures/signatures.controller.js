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
exports.SignaturesController = void 0;
const common_1 = require("@nestjs/common");
const signatures_service_1 = require("./signatures.service");
const sign_contract_dto_1 = require("./dto/sign-contract.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const tenant_isolation_guard_1 = require("../auth/guards/tenant-isolation.guard");
const swagger_1 = require("@nestjs/swagger");
let SignaturesController = class SignaturesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getSignature(id, user) {
        return this.service.getSignature(id, user.tenantId);
    }
    async signContract(dto) {
        return this.service.signContract(dto);
    }
};
exports.SignaturesController = SignaturesController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('signatures:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SignaturesController.prototype, "getSignature", null);
__decorate([
    (0, common_1.Post)('sign'),
    (0, permissions_decorator_1.Permissions)('signatures:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_contract_dto_1.SignContractDto]),
    __metadata("design:returntype", Promise)
], SignaturesController.prototype, "signContract", null);
exports.SignaturesController = SignaturesController = __decorate([
    (0, swagger_1.ApiTags)('Signatures'),
    (0, common_1.Controller)('signatures'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [signatures_service_1.SignaturesService])
], SignaturesController);
//# sourceMappingURL=signatures.controller.js.map