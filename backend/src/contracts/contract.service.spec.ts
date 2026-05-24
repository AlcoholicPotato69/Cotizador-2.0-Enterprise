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
            client: {
              $transaction: jest.fn((callback) => {
                const tx = {
                  $executeRaw: jest.fn(),
                  signature: { count: jest.fn() },
                };
                return callback(tx);
              }),
            },
          },
        },
        { provide: ContractsRepository, useValue: { create: jest.fn(), findByIdForUpdate: jest.fn(), update: jest.fn() } },
        { provide: QuotesRepository, useValue: { findByIdForUpdate: jest.fn(), update: jest.fn() } },
        { provide: DocumentsRepository, useValue: { findLatest: jest.fn(), create: jest.fn() } },
        { provide: SignaturesRepository, useValue: { create: jest.fn(), countByContract: jest.fn() } },
        { provide: FsmValidator, useValue: { validateTransition: jest.fn(), validateSignatureEligibility: jest.fn() } },
        { provide: DomainEventPublisher, useValue: { publish: jest.fn() } },
      ],
    }).compile();

    service = module.get<ContractEngineService>(ContractEngineService);
    prisma = module.get(PrismaService) as any;
    contractsRepo = module.get(ContractsRepository) as any;
    quotesRepo = module.get(QuotesRepository) as any;
    documentsRepo = module.get(DocumentsRepository) as any;
    signaturesRepo = module.get(SignaturesRepository) as any;
    fsmValidator = module.get(FsmValidator) as any;
    eventPublisher = module.get(DomainEventPublisher) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createContract', () => {
    it('should handle Hash Chain Collision gracefully', async () => {
      const dto = { quoteId: 'quote-1', currencyCode: 'USD' };
      
      contractsRepo.create.mockResolvedValue({ id: 'contract-1', status: ContractStatus.DRAFT } as any);
      documentsRepo.findLatest.mockResolvedValue({ chainHash: 'PREV_HASH' } as any);
      
      documentsRepo.create.mockRejectedValue({ code: 'P2002' }); // Simulate Prisma unique constraint failure

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        await expect(service.createContract(dto)).rejects.toThrow('Hash Chain Collision detected.');
      });
    });

    it('should generate contract successfully', async () => {
      const dto = { quoteId: 'quote-1', currencyCode: 'USD' };
      
      contractsRepo.create.mockResolvedValue({ id: 'contract-1', status: ContractStatus.DRAFT } as any);
      documentsRepo.findLatest.mockResolvedValue({ chainHash: 'PREV_HASH' } as any);
      documentsRepo.create.mockResolvedValue({ id: 'doc-1' } as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.createContract(dto);
        expect(result).toBe('contract-1');
        
        expect(eventPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({
          eventName: 'contract.generated',
          payload: { contractId: 'contract-1', quoteId: 'quote-1' }
        }));
      });
    });
  });

  describe('registerSignature', () => {
    it.each(
      Object.values(ContractStatus).filter(s => s !== ContractStatus.DRAFT && s !== ContractStatus.PENDING_SIGNATURE)
    )('should throw BadRequestException if contract is in %s state via FSM', async (status) => {
      const intent = { contractId: 'contract-1', participantName: 'John', participantRole: 'Client', signatureData: 'data' };
      
      contractsRepo.findByIdForUpdate.mockResolvedValue({ id: 'contract-1', status } as any);
      signaturesRepo.countByContract.mockResolvedValue(0);
      
      fsmValidator.validateSignatureEligibility.mockImplementation((s) => {
        if (s === status) {
          throw new BadRequestException(`Cannot sign contract in state ${s}`);
        }
      });

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        await expect(service.registerSignature(intent)).rejects.toThrow(BadRequestException);
      });
    });

    it('should handle Hash Chain Collision during signature registration', async () => {
      const intent = { contractId: 'contract-1', participantName: 'John', participantRole: 'Client', signatureData: 'data' };
      
      contractsRepo.findByIdForUpdate.mockResolvedValue({ id: 'contract-1', status: ContractStatus.PENDING_SIGNATURE } as any);
      
      signaturesRepo.countByContract.mockResolvedValue(0); // First signature
      fsmValidator.validateSignatureEligibility.mockReturnValue(undefined);

      signaturesRepo.create.mockResolvedValue({ id: 'sig-1' } as any);
      documentsRepo.create.mockRejectedValue({ code: 'P2002' });

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        await expect(service.registerSignature(intent)).rejects.toThrow('Hash Chain Collision detected during signature.');
      });
    });

    it('should transition to SIGNED when 2nd signature is added', async () => {
      const intent = { contractId: 'contract-1', participantName: 'Jane', participantRole: 'Vendor', signatureData: 'data' };
      
      contractsRepo.findByIdForUpdate.mockResolvedValue({ id: 'contract-1', status: ContractStatus.PENDING_SIGNATURE } as any);
      
      signaturesRepo.countByContract.mockResolvedValue(1); // There is 1 already, this will be 2nd
      fsmValidator.validateSignatureEligibility.mockReturnValue(undefined);
      fsmValidator.validateTransition.mockReturnValue(undefined);

      signaturesRepo.create.mockResolvedValue({ id: 'sig-2' } as any);
      
      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.registerSignature(intent);
        
        expect(result).toBe('sig-2');
        expect(contractsRepo.update).toHaveBeenCalledWith(expect.anything(), 'tenant-1', 'contract-1', { status: ContractStatus.SIGNED });
        expect(eventPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({
          eventName: 'contract.signed',
          payload: { contractId: 'contract-1', signatureId: 'sig-2', status: ContractStatus.SIGNED }
        }));
      });
    });
  });
});
