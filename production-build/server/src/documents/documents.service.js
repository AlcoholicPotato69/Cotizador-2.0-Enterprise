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
var DocumentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const pdf_service_1 = require("../pdf/pdf.service");
let DocumentsService = DocumentsService_1 = class DocumentsService {
    eventEmitter;
    pdfService;
    logger = new common_1.Logger(DocumentsService_1.name);
    constructor(eventEmitter, pdfService) {
        this.eventEmitter = eventEmitter;
        this.pdfService = pdfService;
    }
    async generatePdf(tenantId, documentId, templateId, data) {
        this.logger.log(`Generating PDF for document ${documentId} using template ${templateId}`);
        const outputFileName = `${documentId}.pdf`;
        const pdfPath = await this.pdfService.generatePdfFromView({
            tenantId,
            templateName: templateId,
            context: data,
            outputFileName
        });
        const pdfUrl = `/uploads/${outputFileName}`;
        this.eventEmitter.emit('document.pdf_generated', {
            tenantId,
            documentId,
            url: pdfUrl,
            timestamp: new Date(),
        });
        return {
            documentId,
            url: pdfUrl,
            status: 'GENERATED',
        };
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = DocumentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        pdf_service_1.PdfService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map