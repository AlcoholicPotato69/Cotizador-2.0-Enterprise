import { Test, TestingModule } from '@nestjs/testing';
import { QuotesService } from './quotes.service';
import { QuotesRepository } from './quotes.repository';
import { FsmValidator } from '../common/fsm.validator';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';
import { QuoteStatus } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('QuotesService', () => {
  let service: QuotesService;
  let repo: jest.Mocked<QuotesRepository>;
  let fsmValidator: jest.Mocked<FsmValidator>;
  let eventPublisher: jest.Mocked<DomainEventPublisher>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        {
          provide: QuotesRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: FsmValidator,
          useValue: {
            validateTransition: jest.fn(),
          },
        },
        {
          provide: DomainEventPublisher,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
    repo = module.get(QuotesRepository) as any;
    fsmValidator = module.get(FsmValidator) as any;
    eventPublisher = module.get(DomainEventPublisher) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if tenant context is missing', async () => {
      await expect(service.create({ importeTotal: 100 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should create a quote and publish quote.created event', async () => {
      const createData = { importeTotal: 100, desglosePrecios: {} } as any;
      const createdQuote = { id: 'quote-1', tenantId: 'tenant-1', status: QuoteStatus.DRAFT, ...createData };
      repo.create.mockResolvedValue(createdQuote as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.create(createData);

        expect(result).toEqual(createdQuote);
        expect(repo.create).toHaveBeenCalledWith({
          ...createData,
          tenantId: 'tenant-1',
          status: QuoteStatus.DRAFT,
          desglosePrecios: {},
        });

        expect(eventPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({
          eventName: 'quote.created',
          tenantId: 'tenant-1',
          payload: { quoteId: 'quote-1' },
        }));
      });
    });
  });

  describe('updateStatus', () => {
    it('should throw NotFoundException if tenant context is missing', async () => {
      await expect(service.updateStatus('quote-1', QuoteStatus.SENT)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if quote not found', async () => {
      repo.findById.mockResolvedValue(null);
      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        await expect(service.updateStatus('quote-1', QuoteStatus.SENT)).rejects.toThrow(NotFoundException);
      });
    });

    it('should successfully update status, validate transition, and publish event', async () => {
      const quote = { id: 'quote-1', tenantId: 'tenant-1', status: QuoteStatus.DRAFT };
      const targetStatus = QuoteStatus.SENT;
      const updatedQuote = { ...quote, status: targetStatus };

      repo.findById.mockResolvedValue(quote as any);
      repo.update.mockResolvedValue(updatedQuote as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.updateStatus('quote-1', targetStatus);

        expect(result).toEqual(updatedQuote);
        expect(repo.findById).toHaveBeenCalledWith('tenant-1', 'quote-1');
        expect(fsmValidator.validateTransition).toHaveBeenCalledWith('Quote', QuoteStatus.DRAFT, targetStatus);
        expect(repo.update).toHaveBeenCalledWith('tenant-1', 'quote-1', { status: targetStatus });

        expect(eventPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({
          eventName: 'quote.status_updated',
          tenantId: 'tenant-1',
          payload: { quoteId: 'quote-1', oldStatus: QuoteStatus.DRAFT, newStatus: targetStatus },
        }));
      });
    });

    it('should fail if FSM validation fails', async () => {
      const quote = { id: 'quote-1', tenantId: 'tenant-1', status: QuoteStatus.DRAFT };
      repo.findById.mockResolvedValue(quote as any);
      fsmValidator.validateTransition.mockImplementation(() => {
        throw new BadRequestException('Invalid transition');
      });

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        await expect(service.updateStatus('quote-1', QuoteStatus.APPROVED)).rejects.toThrow(BadRequestException);
      });

      expect(repo.update).not.toHaveBeenCalled();
      expect(eventPublisher.publish).not.toHaveBeenCalled();
    });
  });
});
