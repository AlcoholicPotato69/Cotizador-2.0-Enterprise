import { Test, TestingModule } from '@nestjs/testing';
import { FinancialFileController } from './financial-file.controller';
import { FinancialFileService } from './financial-file.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('FinancialFileController', () => {
  let controller: FinancialFileController;
  let service: jest.Mocked<FinancialFileService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialFileController],
      providers: [
        {
          provide: FinancialFileService,
          useValue: {
            createFinancialFile: jest.fn(),
            getFinancialFiles: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<FinancialFileController>(FinancialFileController);
    service = module.get(FinancialFileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFinancialFile', () => {
    it('should call service with tenantId from request', async () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      const dto = { invoiceId: 'invoice-1', url: 'url' };
      service.createFinancialFile.mockResolvedValue('file-1' as any);

      const result = await controller.createFinancialFile(req, dto);

      expect(service.createFinancialFile).toHaveBeenCalledWith('tenant-1', dto);
      expect(result).toEqual('file-1');
    });
  });

  describe('getFinancialFiles', () => {
    it('should call service with tenantId from request', async () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      service.getFinancialFiles.mockResolvedValue([]);

      const result = await controller.getFinancialFiles(req, 'invoice-1');

      expect(service.getFinancialFiles).toHaveBeenCalledWith(
        'tenant-1',
        'invoice-1',
      );
      expect(result).toEqual([]);
    });
  });
});
