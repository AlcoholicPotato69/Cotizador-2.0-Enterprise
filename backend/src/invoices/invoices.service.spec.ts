import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../prisma/prisma.service';
import { InvoicesRepository } from './invoices.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { FsmValidator } from '../common/fsm.validator';
import { tenantContext } from '../prisma/tenant-context';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

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
            client: {
              $transaction: jest.fn((callback) => {
                const tx = {
                  $executeRaw: jest.fn(),
                };
                return callback(tx);
              }),
            },
          },
        },
        { provide: InvoicesRepository, useValue: { create: jest.fn() } },
        { provide: DomainEventPublisher, useValue: { publish: jest.fn() } },
        { provide: FsmValidator, useValue: { validateInvoiceGenerationEligibility: jest.fn() } },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    prisma = module.get(PrismaService) as any;
    invoicesRepo = module.get(InvoicesRepository) as any;
    eventPublisher = module.get(DomainEventPublisher) as any;
    fsmValidator = module.get(FsmValidator) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateInvoice', () => {
    it('should generate invoice successfully', async () => {
      invoicesRepo.create.mockResolvedValue({ id: 'inv-1', status: InvoiceStatus.DRAFT } as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.generateInvoice({
          contractId: 'contract-1',
          totalAmount: new Prisma.Decimal(100),
          currencyCode: 'USD',
        });
        
        expect(result).toBe('inv-1');
        expect(eventPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({
          eventName: 'invoice.generated',
          payload: expect.objectContaining({ invoiceId: 'inv-1' })
        }));
      });
    });
  });
});
