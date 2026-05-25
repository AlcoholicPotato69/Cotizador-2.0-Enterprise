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
var ContractsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const contract_service_1 = require("./contract.service");
const tenant_context_1 = require("../prisma/tenant-context");
let ContractsListener = ContractsListener_1 = class ContractsListener {
    contractEngineService;
    logger = new common_1.Logger(ContractsListener_1.name);
    constructor(contractEngineService) {
        this.contractEngineService = contractEngineService;
    }
    async handleQuoteStatusUpdated(event) {
        if (!event || !event.tenantId || !event.payload)
            return;
        const { quoteId, clientId, currencyCode, newStatus } = event.payload;
        if (newStatus !== 'APPROVED')
            return;
        tenant_context_1.tenantContext.run({ tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' }, async () => {
            try {
                await this.contractEngineService.createContract({ clientId, quoteId, currencyCode: currencyCode || 'USD' });
                this.logger.log(`Contract generated for quote: ${quoteId}`);
            }
            catch (error) {
                this.logger.error(`Failed to generate contract for quote: ${quoteId}`, error);
            }
        });
    }
};
exports.ContractsListener = ContractsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('quote.status_updated', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContractsListener.prototype, "handleQuoteStatusUpdated", null);
exports.ContractsListener = ContractsListener = ContractsListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contract_service_1.ContractEngineService])
], ContractsListener);
//# sourceMappingURL=contracts.listener.js.map