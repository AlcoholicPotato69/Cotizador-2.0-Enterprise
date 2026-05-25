import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FinancialFileService } from './financial-file.service';
import { FinancialFileRepository } from './financial-file.repository';
import { FinancialFileCreatedEvent } from '../events/file.events';

describe('FinancialFileService', () => {
  let service: FinancialFileService;
  let repository: jest.Mocked<FinancialFileRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialFileService,
        {
          provide: FinancialFileRepository,
          useValue: {
            createFinancialFile: jest.fn(),
            findFinancialFiles: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FinancialFileService>(FinancialFileService);
    repository = module.get(FinancialFileRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFinancialFile', () => {
    it('should create a financial file and emit an event', async () => {
      const tenantId = 'tenant-1';
      const dto = {
        invoiceId: 'invoice-1',
        url: 'http://example.com/invoice.pdf',
      };
      const createdFile = {
        id: 'file-1',
        tenantId,
        invoiceId: 'invoice-1',
        url: dto.url,
      } as any;

      repository.createFinancialFile.mockResolvedValue(createdFile);

      const result = await service.createFinancialFile(tenantId, dto);

      expect(repository.createFinancialFile).toHaveBeenCalledWith({
        tenantId,
        invoiceId: dto.invoiceId,
        url: dto.url,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'financialFile.created',
        expect.any(FinancialFileCreatedEvent),
      );
      expect(result).toEqual(createdFile);
    });
  });

  describe('getFinancialFiles', () => {
    it('should return files for a given tenant and invoice', async () => {
      const tenantId = 'tenant-1';
      const invoiceId = 'invoice-1';
      const files = [{ id: 'file-1' }] as any[];

      repository.findFinancialFiles.mockResolvedValue(files);

      const result = await service.getFinancialFiles(tenantId, invoiceId);

      expect(repository.findFinancialFiles).toHaveBeenCalledWith(
        tenantId,
        invoiceId,
      );
      expect(result).toEqual(files);
    });
  });
});
