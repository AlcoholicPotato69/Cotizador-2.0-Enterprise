import { EventEmitter2 } from '@nestjs/event-emitter';
import { PdfService } from '../pdf/pdf.service';
export declare class DocumentsService {
    private readonly eventEmitter;
    private readonly pdfService;
    private readonly logger;
    constructor(eventEmitter: EventEmitter2, pdfService: PdfService);
    generatePdf(tenantId: string, documentId: string, templateId: string, data: any): Promise<{
        documentId: string;
        url: string;
        status: string;
    }>;
}
