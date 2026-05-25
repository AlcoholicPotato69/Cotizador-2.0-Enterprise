import { Test, TestingModule } from '@nestjs/testing';
import { QuoteFileController } from './quote-file.controller';
import { QuoteFileService } from './quote-file.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('QuoteFileController', () => {
  let controller: QuoteFileController;
  let service: jest.Mocked<QuoteFileService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteFileController],
      providers: [
        {
          provide: QuoteFileService,
          useValue: {
            createQuoteFile: jest.fn(),
            getQuoteFiles: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<QuoteFileController>(QuoteFileController);
    service = module.get(QuoteFileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createQuoteFile', () => {
    it('should call service with tenantId from request', async () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      const dto = { quoteId: 'quote-1', url: 'url' };
      service.createQuoteFile.mockResolvedValue('file-1' as any);

      const result = await controller.createQuoteFile(req, dto);

      expect(service.createQuoteFile).toHaveBeenCalledWith('tenant-1', dto);
      expect(result).toEqual('file-1');
    });
  });

  describe('getQuoteFiles', () => {
    it('should call service with tenantId from request', async () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      service.getQuoteFiles.mockResolvedValue([]);

      const result = await controller.getQuoteFiles(req, 'quote-1');

      expect(service.getQuoteFiles).toHaveBeenCalledWith('tenant-1', 'quote-1');
      expect(result).toEqual([]);
    });
  });
});
