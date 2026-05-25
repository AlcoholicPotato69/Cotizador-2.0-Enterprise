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
var PaymentAllocationListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentAllocationListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../prisma/prisma.service");
const payment_allocations_repository_1 = require("./payment-allocations.repository");
let PaymentAllocationListener = PaymentAllocationListener_1 = class PaymentAllocationListener {
    prisma;
    allocationsRepo;
    logger = new common_1.Logger(PaymentAllocationListener_1.name);
    constructor(prisma, allocationsRepo) {
        this.prisma = prisma;
        this.allocationsRepo = allocationsRepo;
    }
    async handlePaymentAllocated(event) {
        const { tenantId, payload } = event;
        const { paymentId, invoiceId, allocatedAmount } = payload;
        this.logger.log(`Registering payment allocation: ${allocatedAmount} for payment ${paymentId} on invoice ${invoiceId}`);
        try {
            await this.prisma.$transaction(async (tx) => {
                await this.allocationsRepo.create(tx, {
                    tenantId,
                    paymentId,
                    invoiceId,
                    allocatedAmount
                });
            });
        }
        catch (error) {
            this.logger.error(`Failed to register payment allocation for payment ${paymentId}`, error);
        }
    }
};
exports.PaymentAllocationListener = PaymentAllocationListener;
__decorate([
    (0, event_emitter_1.OnEvent)('invoice.payment_allocated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentAllocationListener.prototype, "handlePaymentAllocated", null);
exports.PaymentAllocationListener = PaymentAllocationListener = PaymentAllocationListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payment_allocations_repository_1.PaymentAllocationsRepository])
], PaymentAllocationListener);
//# sourceMappingURL=payment-allocation.listener.js.map