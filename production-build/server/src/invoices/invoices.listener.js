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
exports.InvoicesListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const invoices_repository_1 = require("./invoices.repository");
const prisma_service_1 = require("../prisma/prisma.service");
const fsm_validator_1 = require("../common/fsm.validator");
const client_1 = require("@prisma/client");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
let InvoicesListener = class InvoicesListener {
    prisma;
    invoicesRepo;
    fsmValidator;
    eventPublisher;
    constructor(prisma, invoicesRepo, fsmValidator, eventPublisher) {
        this.prisma = prisma;
        this.invoicesRepo = invoicesRepo;
        this.fsmValidator = fsmValidator;
        this.eventPublisher = eventPublisher;
    }
    async handlePaymentApproved(event) {
        const { tenantId, payload } = event;
        const { invoiceId, amount, paymentId } = payload;
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
        SELECT set_config('app.current_tenant_id', ${tenantId}, TRUE)
      `;
            const invoice = await this.invoicesRepo.findByIdForUpdate(tx, tenantId, invoiceId);
            if (!invoice)
                throw new common_1.BadRequestException('Invoice not found for payment');
            const paymentAmount = new client_1.Prisma.Decimal(amount);
            const newAmountPaid = invoice.amountPaid.add(paymentAmount);
            const newBalanceDue = invoice.totalAmount.sub(newAmountPaid);
            let newStatus = invoice.status;
            if (newBalanceDue.lte(0)) {
                newStatus = client_1.InvoiceStatus.PAID;
            }
            else if (newAmountPaid.gt(0)) {
                newStatus = client_1.InvoiceStatus.PARTIALLY_PAID;
            }
            const allocatedAmount = newBalanceDue.lt(0)
                ? paymentAmount.sub(newBalanceDue.abs())
                : paymentAmount;
            if (newStatus !== invoice.status) {
                this.fsmValidator.validateTransition('Invoice', invoice.status, newStatus);
            }
            await this.invoicesRepo.update(tx, tenantId, invoice.id, {
                amountPaid: newAmountPaid,
                balanceDue: newBalanceDue.lt(0) ? new client_1.Prisma.Decimal(0) : newBalanceDue,
                status: newStatus,
                paymentStatus: newStatus === client_1.InvoiceStatus.PAID ? 'PAID' : 'PARTIAL'
            });
            await tx.outboxEvent.create({
                data: {
                    tenantId,
                    aggregateType: 'Invoice',
                    aggregateId: invoice.id,
                    eventType: 'invoice.payment_allocated',
                    payload: {
                        paymentId,
                        invoiceId: invoice.id,
                        allocatedAmount: allocatedAmount.toNumber()
                    },
                    status: 'PENDING'
                }
            });
            if (newStatus === client_1.InvoiceStatus.PAID) {
                await tx.outboxEvent.create({
                    data: {
                        tenantId,
                        aggregateType: 'Invoice',
                        aggregateId: invoice.id,
                        eventType: 'invoice.paid',
                        payload: { invoiceId: invoice.id, contractId: invoice.contractSnapshotId, paymentId },
                        status: 'PENDING'
                    }
                });
            }
            if (newBalanceDue.lt(0)) {
                await tx.outboxEvent.create({
                    data: {
                        tenantId,
                        aggregateType: 'Invoice',
                        aggregateId: invoice.id,
                        eventType: 'invoice.overpaid',
                        payload: {
                            invoiceId: invoice.id,
                            clientId: invoice.clientSnapshotId || 'unknown',
                            overpaymentAmount: Math.abs(newBalanceDue.toNumber())
                        },
                        status: 'PENDING'
                    }
                });
            }
        });
    }
    async handlePaymentRefunded(event) {
        const { tenantId, payload } = event;
        const { invoiceId, amount, paymentId } = payload;
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
        SELECT set_config('app.current_tenant_id', ${tenantId}, TRUE)
      `;
            const invoice = await this.invoicesRepo.findByIdForUpdate(tx, tenantId, invoiceId);
            if (!invoice)
                throw new common_1.BadRequestException('Invoice not found for refund');
            const refundAmount = new client_1.Prisma.Decimal(amount);
            const newAmountPaid = invoice.amountPaid.sub(refundAmount).lt(0) ? new client_1.Prisma.Decimal(0) : invoice.amountPaid.sub(refundAmount);
            const newBalanceDue = invoice.totalAmount.sub(newAmountPaid);
            let newStatus = invoice.status;
            if (newAmountPaid.lte(0)) {
                newStatus = client_1.InvoiceStatus.STAMPED;
            }
            else if (newBalanceDue.gt(0)) {
                newStatus = client_1.InvoiceStatus.PARTIALLY_PAID;
            }
            await this.invoicesRepo.update(tx, tenantId, invoice.id, {
                amountPaid: newAmountPaid,
                balanceDue: newBalanceDue,
                status: newStatus,
                paymentStatus: newStatus === client_1.InvoiceStatus.STAMPED ? 'UNPAID' : 'PARTIAL'
            });
        });
    }
};
exports.InvoicesListener = InvoicesListener;
__decorate([
    (0, event_emitter_1.OnEvent)('payment.approved'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoicesListener.prototype, "handlePaymentApproved", null);
__decorate([
    (0, event_emitter_1.OnEvent)('payment.refunded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoicesListener.prototype, "handlePaymentRefunded", null);
exports.InvoicesListener = InvoicesListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        invoices_repository_1.InvoicesRepository,
        fsm_validator_1.FsmValidator,
        domain_event_publisher_1.DomainEventPublisher])
], InvoicesListener);
//# sourceMappingURL=invoices.listener.js.map