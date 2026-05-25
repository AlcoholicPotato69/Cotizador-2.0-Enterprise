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
var CustomerCreditsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCreditsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const customer_credits_events_1 = require("./events/customer-credits.events");
const customer_credits_service_1 = require("./customer-credits.service");
let CustomerCreditsListener = CustomerCreditsListener_1 = class CustomerCreditsListener {
    customerCreditsService;
    logger = new common_1.Logger(CustomerCreditsListener_1.name);
    constructor(customerCreditsService) {
        this.customerCreditsService = customerCreditsService;
    }
    handleTransactionCreated(event) {
        this.logger.log(`Credit transaction created: ${event.transactionId} for client: ${event.clientId}`);
    }
    handleBalanceUpdated(event) {
        this.logger.log(`Credit balance updated for client: ${event.clientId}. New balance: ${event.newBalance}`);
    }
    async handleInvoiceOverpaid(event) {
        const { tenantId, payload } = event;
        const { invoiceId, clientId, overpaymentAmount } = payload;
        if (!clientId) {
            this.logger.warn(`Invoice overpaid but no clientId provided for invoice: ${invoiceId}`);
            return;
        }
        try {
            this.logger.log(`Registering overpayment of ${overpaymentAmount} for client ${clientId} from invoice ${invoiceId}`);
            await this.customerCreditsService.addTransaction(tenantId, {
                clientId,
                amount: overpaymentAmount,
                type: 'OVERPAYMENT',
                referenceId: invoiceId,
                notes: `Overpayment from invoice ${invoiceId}`
            }, 'SYSTEM');
        }
        catch (error) {
            this.logger.error(`Failed to register overpayment for invoice ${invoiceId}`, error);
        }
    }
};
exports.CustomerCreditsListener = CustomerCreditsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('credit.transaction.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_credits_events_1.CreditTransactionCreatedEvent]),
    __metadata("design:returntype", void 0)
], CustomerCreditsListener.prototype, "handleTransactionCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('credit.balance.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_credits_events_1.CreditBalanceUpdatedEvent]),
    __metadata("design:returntype", void 0)
], CustomerCreditsListener.prototype, "handleBalanceUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('invoice.overpaid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerCreditsListener.prototype, "handleInvoiceOverpaid", null);
exports.CustomerCreditsListener = CustomerCreditsListener = CustomerCreditsListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_credits_service_1.CustomerCreditsService])
], CustomerCreditsListener);
//# sourceMappingURL=customer-credits.listener.js.map