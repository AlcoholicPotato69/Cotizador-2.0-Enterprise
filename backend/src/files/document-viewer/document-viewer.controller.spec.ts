import { Test, TestingModule } from '@nestjs/testing';
import { DocumentViewerController } from './document-viewer.controller';
import { DocumentViewerService } from './document-viewer.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('DocumentViewerController', () => {
  let controller: DocumentViewerController;
  let service: jest.Mocked<DocumentViewerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentViewerController],
      providers: [
        {
          provide: DocumentViewerService,
          useValue: {
            generateSignedUrl: jest.fn(),
            viewDocument: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<DocumentViewerController>(DocumentViewerController);
    service = module.get(DocumentViewerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateSignedUrl', () => {
    it('should return a signed url', () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      service.generateSignedUrl.mockReturnValue('signed-url');

      const result = controller.generateSignedUrl(req, 'client', 'file-1', 60);

      expect(service.generateSignedUrl).toHaveBeenCalledWith(
        'tenant-1',
        'client',
        'file-1',
        60,
      );
      expect(result).toEqual({ url: 'signed-url' });
    });
  });

  describe('viewDocument', () => {
    it('should redirect to the document url', async () => {
      const mockDocument = {
        url: 'https://s3.amazonaws.com/test-bucket/document.pdf',
      };
      (service.viewDocument as jest.Mock).mockResolvedValue(mockDocument);

      const mockRes = {
        setHeader: jest.fn(),
        redirect: jest.fn(),
      };

      const mockReq = {
        user: { role: 'USER', tenantId: 'tenant-1' },
      };

      await controller.viewDocument(
        mockReq as any,
        'tenant-1',
        'client',
        'file-1',
        '1234567890',
        'valid-signature',
        mockRes,
      );

      expect(service.viewDocument).toHaveBeenCalledWith(
        'tenant-1',
        'client',
        'file-1',
        1234567890,
        'valid-signature',
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'inline; filename="document-file-1.pdf"',
      );
      expect(mockRes.redirect).toHaveBeenCalledWith(mockDocument.url);
    });
  });
});
