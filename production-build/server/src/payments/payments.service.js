"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const payments_repository_1 = require("./payments.repository");
const payment_evidences_repository_1 = require("./payment-evidences.repository");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const client_1 = require("@prisma/client");
const tenant_context_1 = require("../prisma/tenant-context");
const fsm_validator_1 = require("../common/fsm.validator");
const crypto = __importStar(require("crypto"));
let PaymentsService = class PaymentsService {
    prisma;
    paymentsRepo;
    evidencesRepo;
    eventPublisher;
    fsmValidator;
    constructor(prisma, paymentsRepo, evidencesRepo, eventPublisher, fsmValidator) {
        this.prisma = prisma;
        this.paymentsRepo = paymentsRepo;
        this.evidencesRepo = evidencesRepo;
        this.eventPublisher = eventPublisher;
        this.fsmValidator = fsmValidator;
    }
    async submitPayment(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.prisma.$transaction(async (tx) => {
            const paymentAmountDecimal = new client_1.Prisma.Decimal(dto.paymentAmount);
            const payment = await this.paymentsRepo.create(tx, {
                tenantId: ctx.tenantId,
                invoiceId: dto.invoiceId,
                currencyCode: dto.currencyCode,
                paymentAmount: paymentAmountDecimal,
                status: client_1.PaymentStatus.PENDING,
                invoiceSnapshotId: dto.invoiceId,
                folio: `PAY-${Date.now()}`
            });
            this.fsmValidator.validateTransition('Payment', client_1.PaymentStatus.PENDING, client_1.PaymentStatus.UNDER_REVIEW);
            const currentHash = crypto.createHash('sha256').update(dto.evidenceUrl + payment.id).digest('hex');
            const lastEvidence = await this.evidencesRepo.findLatest(tx, ctx.tenantId);
            const previousHash = lastEvidence ? lastEvidence.chainHash : 'GENESIS';
            const chainHash = crypto.createHash('sha256').update(previousHash + currentHash).digest('hex');
            await this.evidencesRepo.create(tx, {
                tenantId: ctx.tenantId,
                paymentId: payment.id,
                url: dto.evidenceUrl,
                documentHash: currentHash,
                previousDocumentHash: previousHash,
                chainHash: chainHash
            });
            await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, { status: client_1.PaymentStatus.UNDER_REVIEW });
            await tx.outboxEvent.create({
                data: {
                    tenantId: ctx.tenantId,
                    aggregateType: 'Payment',
                    aggregateId: payment.id,
                    eventType: 'payment.created',
                    payload: { paymentId: payment.id },
                    status: 'PENDING'
                }
            });
            return payment.id;
        });
    }
    async approvePayment(paymentId) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;
            const payment = await this.paymentsRepo.findByIdForUpdate(tx, ctx.tenantId, paymentId);
            if (!payment)
                throw new common_1.BadRequestException('Payment not found');
            this.fsmValidator.validateTransition('Payment', payment.status, client_1.PaymentStatus.APPROVED);
            await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, { status: client_1.PaymentStatus.APPROVED });
            await tx.outboxEvent.create({
                data: {
                    tenantId: ctx.tenantId,
                    aggregateType: 'Payment',
                    aggregateId: payment.id,
                    eventType: 'payment.approved',
                    payload: { paymentId: payment.id, invoiceId: payment.invoiceId, amount: payment.paymentAmount.toNumber() },
                    status: 'PENDING'
                }
            });
        });
    }
    async rejectPayment(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        await this.prisma.$transaction(async (tx) => {
            const payment = await this.paymentsRepo.findByIdForUpdate(tx, ctx.tenantId, dto.paymentId);
            if (!payment)
                throw new common_1.BadRequestException('Payment not found');
            this.fsmValidator.validateTransition('Payment', payment.status, client_1.PaymentStatus.REJECTED);
            await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, {
                status: client_1.PaymentStatus.REJECTED,
                rejectionReason: dto.rejectionReason
            });
            await tx.outboxEvent.create({
                data: {
                    tenantId: ctx.tenantId,
                    aggregateType: 'Payment',
                    aggregateId: payment.id,
                    eventType: 'payment.rejected',
                    payload: { paymentId: payment.id, reason: dto.rejectionReason },
                    status: 'PENDING'
                }
            });
        });
    }
    async refundPayment(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        await this.prisma.$transaction(async (tx) => {
            const payment = await this.paymentsRepo.findByIdForUpdate(tx, ctx.tenantId, dto.paymentId);
            if (!payment)
                throw new common_1.BadRequestException('Payment not found');
            this.fsmValidator.validateTransition('Payment', payment.status, client_1.PaymentStatus.REFUNDED);
            await this.paymentsRepo.update(tx, ctx.tenantId, payment.id, {
                status: client_1.PaymentStatus.REFUNDED
            });
            await tx.outboxEvent.create({
                data: {
                    tenantId: ctx.tenantId,
                    aggregateType: 'Payment',
                    aggregateId: payment.id,
                    eventType: 'payment.refunded',
                    payload: { paymentId: payment.id, invoiceId: payment.invoiceId, amount: payment.paymentAmount.toNumber(), reason: dto.refundReason },
                    status: 'PENDING'
                }
            });
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payments_repository_1.PaymentsRepository,
        payment_evidences_repository_1.PaymentEvidencesRepository,
        domain_event_publisher_1.DomainEventPublisher,
        fsm_validator_1.FsmValidator])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map