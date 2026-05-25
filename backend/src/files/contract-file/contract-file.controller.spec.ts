import { Test, TestingModule } from '@nestjs/testing';
import { ContractFileController } from './contract-file.controller';
import { ContractFileService } from './contract-file.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('ContractFileController', () => {
  let controller: ContractFileController;
  let service: jest.Mocked<ContractFileService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractFileController],
      providers: [
        {
          provide: ContractFileService,
          useValue: {
            createContractFile: jest.fn(),
            getContractFiles: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<ContractFileController>(ContractFileController);
    service = module.get(ContractFileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createContractFile', () => {
    it('should call service with tenantId from request', async () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      const dto = { contractId: 'contract-1', url: 'url' };
      service.createContractFile.mockResolvedValue('file-1' as any);

      const result = await controller.createContractFile(req, dto);

      expect(service.createContractFile).toHaveBeenCalledWith('tenant-1', dto);
      expect(result).toEqual('file-1');
    });
  });

  describe('getContractFiles', () => {
    it('should call service with tenantId from request', async () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      service.getContractFiles.mockResolvedValue([]);

      const result = await controller.getContractFiles(req, 'contract-1');

      expect(service.getContractFiles).toHaveBeenCalledWith(
        'tenant-1',
        'contract-1',
      );
      expect(result).toEqual([]);
    });
  });
});
