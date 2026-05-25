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
exports.CustomerCreditsController = void 0;
const common_1 = require("@nestjs/common");
const customer_credits_service_1 = require("./customer-credits.service");
const add_transaction_dto_1 = require("./dto/add-transaction.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const tenant_isolation_guard_1 = require("../auth/guards/tenant-isolation.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const swagger_1 = require("@nestjs/swagger");
let CustomerCreditsController = class CustomerCreditsController {
    customerCreditsService;
    constructor(customerCreditsService) {
        this.customerCreditsService = customerCreditsService;
    }
    async getBalance(user, clientId) {
        return this.customerCreditsService.getBalance(user.tenantId, clientId);
    }
    async addTransaction(user, dto) {
        return this.customerCreditsService.addTransaction(user.tenantId, dto, user.id);
    }
};
exports.CustomerCreditsController = CustomerCreditsController;
__decorate([
    (0, common_1.Get)(':clientId/balance'),
    (0, require_permissions_decorator_1.RequirePermissions)('customer-credits:read'),
    (0, permissions_decorator_1.Permissions)('customer_credits:read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerCreditsController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Post)('transaction'),
    (0, require_permissions_decorator_1.RequirePermissions)('customer-credits:write'),
    (0, permissions_decorator_1.Permissions)('customer_credits:write'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_transaction_dto_1.AddTransactionDto]),
    __metadata("design:returntype", Promise)
], CustomerCreditsController.prototype, "addTransaction", null);
exports.CustomerCreditsController = CustomerCreditsController = __decorate([
    (0, swagger_1.ApiTags)('Customer Credits'),
    (0, common_1.Controller)('customer-credits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [customer_credits_service_1.CustomerCreditsService])
], CustomerCreditsController);
//# sourceMappingURL=customer-credits.controller.js.map