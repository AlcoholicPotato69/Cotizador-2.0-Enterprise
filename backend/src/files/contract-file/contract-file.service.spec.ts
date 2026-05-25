import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContractFileService } from './contract-file.service';
import { ContractFileRepository } from './contract-file.repository';
import { ContractFileCreatedEvent } from '../events/file.events';

describe('ContractFileService', () => {
  let service: ContractFileService;
  let repository: jest.Mocked<ContractFileRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractFileService,
        {
          provide: ContractFileRepository,
          useValue: {
            createContractFile: jest.fn(),
            findContractFiles: jest.fn(),
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

    service = module.get<ContractFileService>(ContractFileService);
    repository = module.get(ContractFileRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createContractFile', () => {
    it('should create a contract file and emit an event', async () => {
      const tenantId = 'tenant-1';
      const dto = {
        contractId: 'contract-1',
        url: 'http://example.com/contract.pdf',
      };
      const createdFile = {
        id: 'file-1',
        tenantId,
        contractId: 'contract-1',
        url: dto.url,
      } as any;

      repository.createContractFile.mockResolvedValue(createdFile);

      const result = await service.createContractFile(tenantId, dto);

      expect(repository.createContractFile).toHaveBeenCalledWith({
        tenantId,
        contractId: dto.contractId,
        url: dto.url,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'contractFile.created',
        expect.any(ContractFileCreatedEvent),
      );
      expect(result).toEqual(createdFile);
    });
  });

  describe('getContractFiles', () => {
    it('should return files for a given tenant and contract', async () => {
      const tenantId = 'tenant-1';
      const contractId = 'contract-1';
      const files = [{ id: 'file-1' }] as any[];

      repository.findContractFiles.mockResolvedValue(files);

      const result = await service.getContractFiles(tenantId, contractId);

      expect(repository.findContractFiles).toHaveBeenCalledWith(
        tenantId,
        contractId,
      );
      expect(result).toEqual(files);
    });
  });
});
