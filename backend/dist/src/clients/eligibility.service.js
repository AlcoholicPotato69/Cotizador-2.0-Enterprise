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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityEngineService = exports.TransactionType = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const tenant_context_1 = require("../prisma/tenant-context");
const clients_repository_1 = require("./clients.repository");
var TransactionType;
(function (TransactionType) {
    TransactionType["QUOTE_CREATION"] = "QUOTE_CREATION";
    TransactionType["CONTRACT_GENERATION"] = "CONTRACT_GENERATION";
    TransactionType["INVOICE_GENERATION"] = "INVOICE_GENERATION";
    TransactionType["PAYMENT_PROCESSING"] = "PAYMENT_PROCESSING";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let EligibilityEngineService = class EligibilityEngineService {
    clientsRepo;
    constructor(clientsRepo) {
        this.clientsRepo = clientsRepo;
    }
    async evaluateEligibility(clientId, transactionType) {
        const ctx = tenant_context_1.tenantContext.getStore();
        const tenantId = ctx?.tenantId;
        if (!tenantId) {
            throw new common_1.ForbiddenException('Tenant context required for eligibility check');
        }
        const client = await this.clientsRepo.findFirst({
            id: clientId,
            tenantId: tenantId
        });
        if (!client) {
            throw new common_1.NotFoundException(`Client ${clientId} not found in current tenant`);
        }
        if (client.status === client_1.ClientStatus.INACTIVE || client.status === client_1.ClientStatus.ARCHIVED || client.status === client_1.ClientStatus.BLACKLISTED) {
            throw new common_1.ForbiddenException(`Client ${clientId} is in a non-eligible status: ${client.status}`);
        }
        switch (transactionType) {
            case TransactionType.CONTRACT_GENERATION:
                if (client.isContractBlocked) {
                    throw new common_1.ForbiddenException(`Client ${clientId} is blocked from generating new contracts`);
                }
                break;
            case TransactionType.INVOICE_GENERATION:
                if (client.isInvoiceBlocked) {
                    throw new common_1.ForbiddenException(`Client ${clientId} is blocked from generating new invoices`);
                }
                break;
            case TransactionType.PAYMENT_PROCESSING:
                if (client.isPaymentBlocked) {
                    throw new common_1.ForbiddenException(`Client ${clientId} is blocked from processing payments`);
                }
                break;
            case TransactionType.QUOTE_CREATION:
                if (!client.isTaxValidated) {
                    throw new common_1.ForbiddenException(`Client ${clientId} is not tax validated. Cannot create quotes.`);
                }
                break;
        }
        return true;
    }
};
exports.EligibilityEngineService = EligibilityEngineService;
exports.EligibilityEngineService = EligibilityEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_repository_1.ClientsRepository])
], EligibilityEngineService);
//# sourceMappingURL=eligibility.service.js.map