import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PdfService } from '../pdf/pdf.service';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const mockPdfService = {
      generatePdfFromView: jest.fn().mockResolvedValue('/path/to/pdf'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: PdfService, useValue: mockPdfService },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatePdf', () => {
    it('should generate PDF URL and emit event', async () => {
      const tenantId = 'tenant-1';
      const documentId = 'doc-1';
      const templateId = 'tpl-1';
      const data = { name: 'Test' };

      const result = await service.generatePdf(
        tenantId,
        documentId,
        templateId,
        data,
      );

      expect(result.documentId).toBe(documentId);
      expect(result.url).toContain('doc-1.pdf');
      expect(result.status).toBe('GENERATED');

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'document.pdf_generated',
        expect.objectContaining({
          tenantId,
          documentId,
          url: result.url,
        }),
      );
    });
  });
});
