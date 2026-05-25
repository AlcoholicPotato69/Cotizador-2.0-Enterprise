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
var PdfListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const pdf_service_1 = require("./pdf.service");
const tenant_context_1 = require("../prisma/tenant-context");
let PdfListener = PdfListener_1 = class PdfListener {
    pdfService;
    logger = new common_1.Logger(PdfListener_1.name);
    constructor(pdfService) {
        this.pdfService = pdfService;
    }
    async handleContractGenerated(event) {
        if (!event || !event.tenantId || !event.payload)
            return;
        tenant_context_1.tenantContext.run({ tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' }, async () => {
            try {
                this.logger.log(`Contract generated event received. Generating PDF...`);
                await this.pdfService.generatePdfFromView({
                    tenantId: event.tenantId,
                    templateName: 'contract-template',
                    context: { contractId: event.payload.contractId },
                    outputFileName: `contract-${event.payload.contractId}.pdf`
                });
            }
            catch (error) {
                this.logger.error(`Error generating PDF for contract: ${error.message}`, error.stack);
            }
        });
    }
    async handleAgreementApproved(event) {
        if (!event || !event.tenantId || !event.agreementId)
            return;
        tenant_context_1.tenantContext.run({ tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' }, async () => {
            try {
                this.logger.log(`Agreement approved event received. Generating PDF...`);
                await this.pdfService.generatePdfFromView({
                    tenantId: event.tenantId,
                    templateName: 'agreement-template',
                    context: { agreementId: event.agreementId },
                    outputFileName: `agreement-${event.agreementId}.pdf`
                });
            }
            catch (error) {
                this.logger.error(`Error generating PDF for agreement: ${error.message}`, error.stack);
            }
        });
    }
};
exports.PdfListener = PdfListener;
__decorate([
    (0, event_emitter_1.OnEvent)('contract.generated', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdfListener.prototype, "handleContractGenerated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('agreement.approved', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdfListener.prototype, "handleAgreementApproved", null);
exports.PdfListener = PdfListener = PdfListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pdf_service_1.PdfService])
], PdfListener);
//# sourceMappingURL=pdf.listener.js.map