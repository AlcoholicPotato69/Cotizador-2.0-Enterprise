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
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const clients_service_1 = require("./clients.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const tenant_context_1 = require("../prisma/tenant-context");
const tenant_isolation_guard_1 = require("../auth/guards/tenant-isolation.guard");
const swagger_1 = require("@nestjs/swagger");
const eligibility_service_1 = require("./eligibility.service");
let ClientsController = class ClientsController {
    clientsService;
    eligibilityService;
    constructor(clientsService, eligibilityService) {
        this.clientsService = clientsService;
        this.eligibilityService = eligibilityService;
    }
    async create(req, data) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, () => this.clientsService.create(data));
    }
    async findAll(req) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, () => this.clientsService.findAll());
    }
    async findById(req, id) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, () => this.clientsService.findById(id));
    }
    async evaluateEligibility(req, id, transactionType) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, async () => {
            const normalized = transactionType.toUpperCase();
            if (!Object.prototype.hasOwnProperty.call(eligibility_service_1.TransactionType, normalized)) {
                throw new common_1.BadRequestException(`Unsupported transactionType: ${transactionType}`);
            }
            const targetTransaction = eligibility_service_1.TransactionType[normalized];
            try {
                await this.eligibilityService.evaluateEligibility(id, targetTransaction);
                return {
                    clientId: id,
                    transactionType: targetTransaction,
                    eligible: true,
                    reasons: [],
                };
            }
            catch (error) {
                if (!(error instanceof common_1.ForbiddenException)) {
                    throw error;
                }
                const response = error.getResponse();
                const reason = typeof response === 'string'
                    ? response
                    : response.message;
                return {
                    clientId: id,
                    transactionType: targetTransaction,
                    eligible: false,
                    reasons: Array.isArray(reason)
                        ? reason
                        : [reason || 'Eligibility check failed'],
                };
            }
        });
    }
    async update(req, id, data) {
        return tenant_context_1.tenantContext.run({ tenantId: req.user.tenantId, userId: req.user.id, role: req.user.role }, () => this.clientsService.update(id, data));
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Execute Post operation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful operation' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }),
    (0, permissions_decorator_1.Permissions)('clients:write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Execute Get operation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful operation' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }),
    (0, permissions_decorator_1.Permissions)('clients:read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute Get operation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful operation' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }),
    (0, permissions_decorator_1.Permissions)('clients:read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)(':id/eligibility/:transactionType'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate client eligibility for a transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Eligibility evaluated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid transaction type' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found' }),
    (0, permissions_decorator_1.Permissions)('clients:read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('transactionType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "evaluateEligibility", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute Put operation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful operation' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }),
    (0, permissions_decorator_1.Permissions)('clients:write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_client_dto_1.UpdateClientDto]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "update", null);
exports.ClientsController = ClientsController = __decorate([
    (0, swagger_1.ApiTags)('Clients'),
    (0, common_1.Controller)('clients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, tenant_isolation_guard_1.TenantIsolationGuard),
    __metadata("design:paramtypes", [clients_service_1.ClientsService,
        eligibility_service_1.EligibilityEngineService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map