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
var PdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const handlebars = __importStar(require("handlebars"));
const puppeteer = __importStar(require("puppeteer"));
let PdfService = PdfService_1 = class PdfService {
    eventPublisher;
    prisma;
    logger = new common_1.Logger(PdfService_1.name);
    constructor(eventPublisher, prisma) {
        this.eventPublisher = eventPublisher;
        this.prisma = prisma;
    }
    async generatePdfFromView(dto) {
        this.logger.log(`Generating PDF for tenant ${dto.tenantId} using view ${dto.templateName}`);
        const enrichedContext = { ...dto.context };
        if (dto.regulationId) {
            const regulationVersion = await this.prisma.regulationVersion.findFirst({
                where: { regulationId: dto.regulationId, tenantId: dto.tenantId },
                orderBy: { createdAt: 'desc' }
            });
            if (regulationVersion) {
                enrichedContext.reglamentoContent = regulationVersion.content;
            }
        }
        if (dto.spaceId) {
            const space = await this.prisma.space.findUnique({
                where: { id: dto.spaceId }
            });
            if (space) {
                const configB2b = space.configB2b;
                enrichedContext.planoGeografico = configB2b?.mapImage || `https://maps.enterprise.local/spaces/${space.id}/map.png`;
            }
        }
        const viewsDir = path.join(process.cwd(), 'views');
        const templatePath = path.join(viewsDir, `${dto.templateName}.hbs`);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);
        const htmlContent = template(enrichedContext);
        const pdfPath = path.join(process.cwd(), 'uploads', dto.outputFileName);
        const uploadsDir = path.dirname(pdfPath);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        });
        await browser.close();
        this.logger.log(`PDF successfully generated: ${pdfPath}`);
        await this.eventPublisher.publish({
            eventName: 'document.pdf_generated',
            tenantId: dto.tenantId,
            payload: {
                templateName: dto.templateName,
                filePath: pdfPath,
            },
            timestamp: new Date()
        });
        return pdfPath;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = PdfService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [domain_event_publisher_1.DomainEventPublisher,
        prisma_service_1.PrismaService])
], PdfService);
//# sourceMappingURL=pdf.service.js.map