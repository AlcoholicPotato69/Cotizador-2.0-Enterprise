import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../prisma/prisma.service';
import { InvoicesRepository } from './invoices.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { FsmValidator } from '../common/fsm.validator';
import { tenantContext } from '../prisma/tenant-context';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let prisma: jest.Mocked<PrismaService>;
  let invoicesRepo: jest.Mocked<InvoicesRepository>;
  let eventPublisher: jest.Mocked<DomainEventPublisher>;
  let fsmValidator: jest.Mocked<FsmValidator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn((callback) => {
              const tx = {
                $executeRaw: jest.fn(),
                outboxEvent: { create: jest.fn() },
              };
              return callback(tx);
            }),
          },
        },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: InvoicesRepository, useValue: { create: jest.fn() } },
        { provide: DomainEventPublisher, useValue: { publish: jest.fn() } },
        {
          provide: FsmValidator,
          useValue: { validateInvoiceGenerationEligibility: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    prisma = module.get(PrismaService);
    invoicesRepo = module.get(InvoicesRepository);
    eventPublisher = module.get(DomainEventPublisher);
    fsmValidator = module.get(FsmValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateInvoice', () => {
    it('should generate invoice successfully', async () => {
      invoicesRepo.create.mockResolvedValue({
        id: 'inv-1',
        status: InvoiceStatus.DRAFT,
      } as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.generateInvoice({
          contractId: 'contract-1',
          totalAmount: new Prisma.Decimal(100),
          currencyCode: 'USD',
        });
        // Check if outboxEvent.create was called on tx object
        expect(result).toBe('inv-1');
        // The transaction tx object is mocked inside the test provider, we need to inspect it
      });
    });
  });
});
