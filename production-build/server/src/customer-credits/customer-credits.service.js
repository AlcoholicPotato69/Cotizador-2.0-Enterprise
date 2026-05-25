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
exports.CustomerCreditsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const customer_credits_repository_1 = require("./customer-credits.repository");
const customer_credits_events_1 = require("./events/customer-credits.events");
let CustomerCreditsService = class CustomerCreditsService {
    repository;
    eventEmitter;
    constructor(repository, eventEmitter) {
        this.repository = repository;
        this.eventEmitter = eventEmitter;
    }
    async getBalance(tenantId, clientId) {
        const balance = await this.repository.getBalance(tenantId, clientId);
        return balance || { tenantId, clientId, balanceAmount: 0 };
    }
    async addTransaction(tenantId, dto, userId) {
        if (dto.amount < 0) {
            const currentBalance = await this.getBalance(tenantId, dto.clientId);
            if (Number(currentBalance.balanceAmount) < Math.abs(dto.amount)) {
                throw new common_1.BadRequestException('Insufficient credit balance');
            }
        }
        const { transaction, balance } = await this.repository.addTransaction({
            tenantId,
            clientId: dto.clientId,
            amount: dto.amount,
            transactionType: dto.type,
            correlationId: dto.referenceId,
            deletedBy: null
        });
        this.eventEmitter.emit('credit.transaction.created', new customer_credits_events_1.CreditTransactionCreatedEvent(tenantId, dto.clientId, transaction.id, Number(transaction.amount)));
        this.eventEmitter.emit('credit.balance.updated', new customer_credits_events_1.CreditBalanceUpdatedEvent(tenantId, dto.clientId, Number(balance.balanceAmount)));
        return { transaction, balance };
    }
};
exports.CustomerCreditsService = CustomerCreditsService;
exports.CustomerCreditsService = CustomerCreditsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_credits_repository_1.CustomerCreditsRepository,
        event_emitter_1.EventEmitter2])
], CustomerCreditsService);
//# sourceMappingURL=customer-credits.service.js.map