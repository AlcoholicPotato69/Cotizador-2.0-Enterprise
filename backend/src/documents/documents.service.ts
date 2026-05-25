import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PdfService } from '../pdf/pdf.service';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly pdfService: PdfService,
  ) {}

  async generatePdf(
    tenantId: string,
    documentId: string,
    templateId: string,
    data: any,
  ) {
    this.logger.log(
      `Generating PDF for document ${documentId} using template ${templateId}`,
    );

    const outputFileName = `${documentId}.pdf`;

    // Call real PDF generation
    const pdfPath = await this.pdfService.generatePdfFromView({
      tenantId,
      templateName: templateId,
      context: data,
      outputFileName,
    });

    // Since it's stored locally now, we map it to an accessible URL (or local path)
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
}
