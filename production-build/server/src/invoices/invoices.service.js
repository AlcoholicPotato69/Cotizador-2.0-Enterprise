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
var InvoicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const invoices_repository_1 = require("./invoices.repository");
const config_1 = require("@nestjs/config");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const fsm_validator_1 = require("../common/fsm.validator");
const client_1 = require("@prisma/client");
const tenant_context_1 = require("../prisma/tenant-context");
const client_2 = require("@prisma/client");
const env_validation_1 = require("../config/env.validation");
let InvoicesService = InvoicesService_1 = class InvoicesService {
    prisma;
    configService;
    invoicesRepo;
    eventPublisher;
    fsmValidator;
    logger = new common_1.Logger(InvoicesService_1.name);
    constructor(prisma, configService, invoicesRepo, eventPublisher, fsmValidator) {
        this.prisma = prisma;
        this.configService = configService;
        this.invoicesRepo = invoicesRepo;
        this.eventPublisher = eventPublisher;
        this.fsmValidator = fsmValidator;
    }
    async generateInvoice(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;
            const totalAmountDecimal = new client_2.Prisma.Decimal(dto.totalAmount);
            const invoice = await this.invoicesRepo.create(tx, {
                tenantId: ctx.tenantId,
                clientId: dto.clientId,
                contractSnapshotId: dto.contractId,
                currencyCode: dto.currencyCode,
                totalAmount: totalAmountDecimal,
                amountPaid: new client_2.Prisma.Decimal(0),
                balanceDue: totalAmountDecimal,
                paymentStatus: 'UNPAID',
                status: client_1.InvoiceStatus.DRAFT,
                folio: `INV-${Date.now()}`
            });
            await tx.outboxEvent.create({
                data: {
                    tenantId: ctx.tenantId,
                    aggregateType: 'Invoice',
                    aggregateId: invoice.id,
                    eventType: 'invoice.generated',
                    payload: { invoiceId: invoice.id, contractId: dto.contractId, totalAmount: totalAmountDecimal.toNumber() },
                    status: 'PENDING'
                }
            });
            return invoice.id;
        });
    }
    async stampInvoice(invoiceId) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        const invoice = await this.prisma.invoice.findFirst({
            where: { id: invoiceId, tenantId: ctx.tenantId }
        });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        const mode = this.configService.get('INVOICE_MODE') || env_validation_1.InvoiceMode.INTERNAL;
        if (mode === env_validation_1.InvoiceMode.INTELISIS) {
            try {
                await this.stampWithIntelisis(invoiceId, ctx.tenantId);
                return {
                    success: true,
                    requiresManualUpload: false,
                    message: 'Stamped via Intelisis'
                };
            }
            catch (error) {
                this.logger.warn(`Intelisis stamping failed for invoice ${invoiceId}. Fallback to manual upload enabled.`);
                return {
                    success: false,
                    requiresManualUpload: true,
                    message: 'External provider failed. Please upload XML/PDF manually.'
                };
            }
        }
        else {
            return {
                success: false,
                requiresManualUpload: true,
                message: 'Internal mode active. Please upload XML/PDF manually.'
            };
        }
    }
    async uploadManualInvoiceFiles(invoiceId, xmlUrl, pdfUrl) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return this.prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.findFirst({
                where: { id: invoiceId, tenantId: ctx.tenantId }
            });
            if (!invoice)
                throw new common_1.NotFoundException('Invoice not found');
            await tx.invoice.updateMany({
                where: { id: invoiceId, tenantId: ctx.tenantId },
                data: {
                    status: client_1.InvoiceStatus.STAMPED,
                }
            });
            const updated = await tx.invoice.findFirst({ where: { id: invoiceId, tenantId: ctx.tenantId } });
            await tx.outboxEvent.create({
                data: {
                    tenantId: ctx.tenantId,
                    aggregateType: 'Invoice',
                    aggregateId: invoice.id,
                    eventType: 'invoice.stamped',
                    payload: { invoiceId, xmlUrl, pdfUrl },
                    status: 'PENDING'
                }
            });
            return updated;
        });
    }
    async stampWithIntelisis(invoiceId, tenantId) {
        const intelisisUrl = this.configService.get('INTELISIS_API_URL');
        if (!intelisisUrl) {
            throw new Error('Intelisis API URL not configured');
        }
        try {
            const response = await fetch(`${intelisisUrl}/stamp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceId, tenantId })
            });
            if (!response.ok) {
                throw new Error(`Intelisis API failed with status ${response.status}`);
            }
            await this.prisma.invoice.updateMany({
                where: { id: invoiceId, tenantId },
                data: { status: client_1.InvoiceStatus.STAMPED }
            });
        }
        catch (error) {
            this.logger.error(`Failed to stamp invoice ${invoiceId} with Intelisis:`, error);
            throw error;
        }
    }
    async getInvoiceReport() {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return this.prisma.invoice.findMany({
            where: { tenantId: ctx.tenantId },
            select: {
                id: true,
                status: true,
                totalAmount: true,
                amountPaid: true,
                balanceDue: true,
                currencyCode: true,
                createdAt: true
            }
        });
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = InvoicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        invoices_repository_1.InvoicesRepository,
        domain_event_publisher_1.DomainEventPublisher,
        fsm_validator_1.FsmValidator])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map