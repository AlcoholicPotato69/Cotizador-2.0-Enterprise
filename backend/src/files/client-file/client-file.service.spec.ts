import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientFileService } from './client-file.service';
import { ClientFileRepository } from './client-file.repository';
import { NotFoundException } from '@nestjs/common';
import {
  ClientFileCreatedEvent,
  ClientFileDocumentAddedEvent,
} from '../events/file.events';

describe('ClientFileService', () => {
  let service: ClientFileService;
  let repository: jest.Mocked<ClientFileRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientFileService,
        {
          provide: ClientFileRepository,
          useValue: {
            createClientFile: jest.fn(),
            findClientFiles: jest.fn(),
            findClientFileById: jest.fn(),
            addDocument: jest.fn(),
            findClientFileDocumentById: jest.fn(),
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

    service = module.get<ClientFileService>(ClientFileService);
    repository = module.get(ClientFileRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createClientFile', () => {
    it('should create a client file and emit an event', async () => {
      const tenantId = 'tenant-1';
      const dto = { clientId: 'client-1', name: 'File 1' };
      const createdFile = {
        id: 'file-1',
        tenantId,
        clientId: 'client-1',
        name: 'File 1',
      } as any;

      repository.createClientFile.mockResolvedValue(createdFile);

      const result = await service.createClientFile(tenantId, dto);

      expect(repository.createClientFile).toHaveBeenCalledWith({
        tenantId,
        clientId: dto.clientId,
        name: dto.name,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'clientFile.created',
        expect.any(ClientFileCreatedEvent),
      );
      expect(result).toEqual(createdFile);
    });
  });

  describe('getClientFiles', () => {
    it('should return files for a given tenant and client', async () => {
      const tenantId = 'tenant-1';
      const clientId = 'client-1';
      const files = [{ id: 'file-1' }] as any[];

      repository.findClientFiles.mockResolvedValue(files);

      const result = await service.getClientFiles(tenantId, clientId);

      expect(repository.findClientFiles).toHaveBeenCalledWith(
        tenantId,
        clientId,
      );
      expect(result).toEqual(files);
    });
  });

  describe('addDocument', () => {
    it('should throw NotFoundException if file not found', async () => {
      const tenantId = 'tenant-1';
      const fileId = 'file-1';
      const dto = { url: 'http://example.com/doc.pdf', documentType: 'ID' };

      repository.findClientFileById.mockResolvedValue(null);

      await expect(service.addDocument(tenantId, fileId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should add a document and emit an event', async () => {
      const tenantId = 'tenant-1';
      const fileId = 'file-1';
      const dto = { url: 'http://example.com/doc.pdf', documentType: 'ID' };
      const file = { id: fileId } as any;
      const document = { id: 'doc-1', documentType: 'ID' } as any;

      repository.findClientFileById.mockResolvedValue(file);
      repository.addDocument.mockResolvedValue(document);

      const result = await service.addDocument(tenantId, fileId, dto);

      expect(repository.addDocument).toHaveBeenCalledWith({
        tenantId,
        clientFileId: fileId,
        url: dto.url,
        documentType: dto.documentType,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'clientFile.documentAdded',
        expect.any(ClientFileDocumentAddedEvent),
      );
      expect(result).toEqual(document);
    });
  });
});
