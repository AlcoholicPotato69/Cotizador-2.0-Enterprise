import { Test, TestingModule } from '@nestjs/testing';
import { ContractEngineService } from './contract.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContractsRepository } from './contracts.repository';
import { QuotesRepository } from '../quotes/quotes.repository';
import { DocumentsRepository } from '../documents/documents.repository';
import { SignaturesRepository } from '../signatures/signatures.repository';
import { FsmValidator } from '../common/fsm.validator';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';
import { ContractStatus, QuoteStatus } from '@prisma/client';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('ContractEngineService', () => {
  let service: ContractEngineService;
  let prisma: jest.Mocked<PrismaService>;
  let contractsRepo: jest.Mocked<ContractsRepository>;
  let quotesRepo: jest.Mocked<QuotesRepository>;
  let documentsRepo: jest.Mocked<DocumentsRepository>;
  let signaturesRepo: jest.Mocked<SignaturesRepository>;
  let fsmValidator: jest.Mocked<FsmValidator>;
  let eventPublisher: jest.Mocked<DomainEventPublisher>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractEngineService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn((callback) => {
              const tx = {
                $executeRaw: jest.fn(),
                signature: { count: jest.fn() },
              };
              return callback(tx);
            }),
            client: {},
          },
        },
        {
          provide: ContractsRepository,
          useValue: {
            create: jest.fn(),
            findByIdForUpdate: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: QuotesRepository,
          useValue: { findByIdForUpdate: jest.fn(), update: jest.fn() },
        },
        {
          provide: DocumentsRepository,
          useValue: { findLatest: jest.fn(), create: jest.fn() },
        },
        {
          provide: SignaturesRepository,
          useValue: { create: jest.fn(), countByContract: jest.fn() },
        },
        {
          provide: FsmValidator,
          useValue: {
            validateTransition: jest.fn(),
            validateSignatureEligibility: jest.fn(),
          },
        },
        { provide: DomainEventPublisher, useValue: { publish: jest.fn() } },
      ],
    }).compile();

    service = module.get<ContractEngineService>(ContractEngineService);
    prisma = module.get(PrismaService);
    contractsRepo = module.get(ContractsRepository);
    quotesRepo = module.get(QuotesRepository);
    documentsRepo = module.get(DocumentsRepository);
    signaturesRepo = module.get(SignaturesRepository);
    fsmValidator = module.get(FsmValidator);
    eventPublisher = module.get(DomainEventPublisher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createContract', () => {
    it('should generate contract successfully', async () => {
      const dto = { quoteId: 'quote-1', currencyCode: 'USD' };

      contractsRepo.create.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.DRAFT,
      } as any);
      documentsRepo.findLatest.mockResolvedValue({
        chainHash: 'PREV_HASH',
      } as any);
      documentsRepo.create.mockResolvedValue({ id: 'doc-1' } as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.createContract(dto);
        expect(result).toBe('contract-1');

        expect(eventPublisher.publish).toHaveBeenCalledWith(
          expect.objectContaining({
            eventName: 'contract.generated',
            payload: {
              contractId: 'contract-1',
              quoteId: 'quote-1',
              status: 'DRAFT',
            },
          }),
        );
      });
    });
  });
});
