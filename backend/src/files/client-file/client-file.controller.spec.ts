import { Test, TestingModule } from '@nestjs/testing';
import { ClientFileController } from './client-file.controller';
import { ClientFileService } from './client-file.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('ClientFileController', () => {
  let controller: ClientFileController;
  let service: jest.Mocked<ClientFileService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientFileController],
      providers: [
        {
          provide: ClientFileService,
          useValue: {
            createClientFile: jest.fn(),
            getClientFiles: jest.fn(),
            addDocument: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<ClientFileController>(ClientFileController);
    service = module.get(ClientFileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createClientFile', () => {
    it('should call service with tenantId from request', async () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      const dto = { clientId: 'client-1', name: 'File 1' };
      service.createClientFile.mockResolvedValue('file-1' as any);

      const result = await controller.createClientFile(req, dto);

      expect(service.createClientFile).toHaveBeenCalledWith('tenant-1', dto);
      expect(result).toEqual('file-1');
    });
  });

  describe('getClientFiles', () => {
    it('should call service with tenantId from request', async () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      service.getClientFiles.mockResolvedValue([]);

      const result = await controller.getClientFiles(req, 'client-1');

      expect(service.getClientFiles).toHaveBeenCalledWith(
        'tenant-1',
        'client-1',
      );
      expect(result).toEqual([]);
    });
  });

  describe('addDocument', () => {
    it('should call service with tenantId from request', async () => {
      const req = { user: { tenantId: 'tenant-1' } } as any;
      const dto = { url: 'url', documentType: 'type' };
      service.addDocument.mockResolvedValue('doc-1' as any);

      const result = await controller.addDocument(req, 'file-1', dto);

      expect(service.addDocument).toHaveBeenCalledWith(
        'tenant-1',
        'file-1',
        dto,
      );
      expect(result).toEqual('doc-1');
    });
  });
});
