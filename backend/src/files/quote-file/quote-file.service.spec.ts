import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QuoteFileService } from './quote-file.service';
import { QuoteFileRepository } from './quote-file.repository';
import { QuoteFileCreatedEvent } from '../events/file.events';

describe('QuoteFileService', () => {
  let service: QuoteFileService;
  let repository: jest.Mocked<QuoteFileRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteFileService,
        {
          provide: QuoteFileRepository,
          useValue: {
            createQuoteFile: jest.fn(),
            findQuoteFiles: jest.fn(),
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

    service = module.get<QuoteFileService>(QuoteFileService);
    repository = module.get(QuoteFileRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createQuoteFile', () => {
    it('should create a quote file and emit an event', async () => {
      const tenantId = 'tenant-1';
      const dto = { quoteId: 'quote-1', url: 'http://example.com/quote.pdf' };
      const createdFile = {
        id: 'file-1',
        tenantId,
        quoteId: 'quote-1',
        url: dto.url,
      } as any;

      repository.createQuoteFile.mockResolvedValue(createdFile);

      const result = await service.createQuoteFile(tenantId, dto);

      expect(repository.createQuoteFile).toHaveBeenCalledWith({
        tenantId,
        quoteId: dto.quoteId,
        url: dto.url,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'quoteFile.created',
        expect.any(QuoteFileCreatedEvent),
      );
      expect(result).toEqual(createdFile);
    });
  });

  describe('getQuoteFiles', () => {
    it('should return files for a given tenant and quote', async () => {
      const tenantId = 'tenant-1';
      const quoteId = 'quote-1';
      const files = [{ id: 'file-1' }] as any[];

      repository.findQuoteFiles.mockResolvedValue(files);

      const result = await service.getQuoteFiles(tenantId, quoteId);

      expect(repository.findQuoteFiles).toHaveBeenCalledWith(tenantId, quoteId);
      expect(result).toEqual(files);
    });
  });
});
