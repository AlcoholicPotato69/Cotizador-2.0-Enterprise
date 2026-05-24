import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsRepository } from './payments.repository';
import { PaymentEvidencesRepository } from './payment-evidences.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { FsmValidator } from '../common/fsm.validator';
import { tenantContext } from '../prisma/tenant-context';
import { PaymentStatus, Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: jest.Mocked<PrismaService>;
  let paymentsRepo: jest.Mocked<PaymentsRepository>;
  let evidencesRepo: jest.Mocked<PaymentEvidencesRepository>;
  let eventPublisher: jest.Mocked<DomainEventPublisher>;
  let fsmValidator: jest.Mocked<FsmValidator>;

  beforeEach(async () => {
    const txMock = {
      $executeRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              $transaction: jest.fn((callback) => callback(txMock)),
            },
          },
        },
        { provide: PaymentsRepository, useValue: { create: jest.fn(), update: jest.fn(), findById: jest.fn(), findByIdForUpdate: jest.fn() } },
        { provide: PaymentEvidencesRepository, useValue: { findLatest: jest.fn(), create: jest.fn() } },
        { provide: DomainEventPublisher, useValue: { publish: jest.fn() } },
        { provide: FsmValidator, useValue: { validateTransition: jest.fn() } },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get(PrismaService) as any;
    paymentsRepo = module.get(PaymentsRepository) as any;
    evidencesRepo = module.get(PaymentEvidencesRepository) as any;
    eventPublisher = module.get(DomainEventPublisher) as any;
    fsmValidator = module.get(FsmValidator) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('submitPayment', () => {
    it('should create payment, save evidence via repo and transition to UNDER_REVIEW', async () => {
      const dto = { invoiceId: 'inv-1', paymentAmount: new Prisma.Decimal(100), evidenceUrl: 'http://evidence.url/1', currencyCode: 'USD' };
      
      paymentsRepo.create.mockResolvedValue({ id: 'pay-1' } as any);
      fsmValidator.validateTransition.mockReturnValue(undefined);
      evidencesRepo.findLatest.mockResolvedValue(null);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.submitPayment(dto);
        
        expect(result).toBe('pay-1');
        expect(paymentsRepo.create).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
          status: PaymentStatus.PENDING,
          paymentAmount: dto.paymentAmount,
          currencyCode: 'USD',
        }));
        
        expect(evidencesRepo.create).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
          paymentId: 'pay-1',
          url: dto.evidenceUrl
        }));
        
        expect(paymentsRepo.update).toHaveBeenCalledWith(expect.anything(), 'tenant-1', 'pay-1', { status: PaymentStatus.UNDER_REVIEW });
        expect(eventPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({
          eventName: 'PAYMENT_UNDER_REVIEW',
          payload: { paymentId: 'pay-1' }
        }));
      });
    });
  });

  describe('approvePayment', () => {
    it('should approve payment', async () => {
      paymentsRepo.findByIdForUpdate.mockResolvedValue({ id: 'pay-1', invoiceId: 'inv-1', paymentAmount: new Prisma.Decimal(40), status: PaymentStatus.UNDER_REVIEW } as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        await service.approvePayment('pay-1');
        
        expect(paymentsRepo.update).toHaveBeenCalledWith(expect.anything(), 'tenant-1', 'pay-1', { status: PaymentStatus.APPROVED });
      });
    });

    it('should throw exception if FSM blocks approval on invalid payment status', async () => {
      paymentsRepo.findByIdForUpdate.mockResolvedValue({ id: 'pay-1', invoiceId: 'inv-1', paymentAmount: new Prisma.Decimal(50), status: PaymentStatus.APPROVED } as any);
      
      fsmValidator.validateTransition.mockImplementation((entity, current, target) => {
        if (entity === 'Payment' && current === PaymentStatus.APPROVED && target === PaymentStatus.APPROVED) {
          throw new BadRequestException('Invalid FSM transition');
        }
      });

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        await expect(service.approvePayment('pay-1')).rejects.toThrow('Invalid FSM transition');
      });
    });
  });
});
