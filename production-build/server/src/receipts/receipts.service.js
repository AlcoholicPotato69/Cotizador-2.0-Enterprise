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
var ReceiptsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../prisma/prisma.service");
const receipts_events_1 = require("./events/receipts.events");
const tenant_context_1 = require("../prisma/tenant-context");
let ReceiptsService = ReceiptsService_1 = class ReceiptsService {
    prisma;
    eventEmitter;
    logger = new common_1.Logger(ReceiptsService_1.name);
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async generateReceiptForPayment(tenantId, paymentId) {
        const ctx = tenant_context_1.tenantContext.getStore();
        const effectiveTenantId = ctx?.tenantId || tenantId;
        if (!effectiveTenantId)
            throw new common_1.ConflictException('Tenant context required');
        this.logger.log(`Generating receipt for payment ${paymentId} (Tenant: ${effectiveTenantId})`);
        const payment = await this.prisma.payment.findFirst({
            where: { id: paymentId, tenantId: effectiveTenantId },
            include: { invoice: true },
        });
        if (!payment) {
            throw new Error(`Payment ${paymentId} not found`);
        }
        const financialFile = await this.prisma.financialFile.create({
            data: {
                tenantId,
                invoiceId: payment.invoiceId,
                url: `https://storage.example.com/receipts/${paymentId}.pdf`,
            },
        });
        this.eventEmitter.emit('receipt.generated', new receipts_events_1.ReceiptGeneratedEvent(tenantId, paymentId, financialFile.id));
        return financialFile;
    }
};
exports.ReceiptsService = ReceiptsService;
exports.ReceiptsService = ReceiptsService = ReceiptsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], ReceiptsService);
//# sourceMappingURL=receipts.service.js.map