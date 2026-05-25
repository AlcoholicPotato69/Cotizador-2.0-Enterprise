import { Test, TestingModule } from '@nestjs/testing';
import { AgreementsService } from './agreements.service';
import { AgreementsRepository } from './agreements.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AgreementStatusEnum } from '@prisma/client';

describe('AgreementsService', () => {
  let service: AgreementsService;
  let repository: AgreementsRepository;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgreementsService,
        { provide: AgreementsRepository, useValue: mockRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<AgreementsService>(AgreementsService);
    repository = module.get<AgreementsRepository>(AgreementsRepository);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('FSM Transitions (Draft -> Signed)', () => {
    const tenantId = 'tenant-1';
    const agreementId = 'agreement-1';
    const userId = 'user-1';

    it('should transition to UNDER_REVIEW and emit event', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue({
        id: agreementId,
        status: AgreementStatusEnum.UNDER_REVIEW,
      } as any);

      const result = await service.submitForReview(
        tenantId,
        agreementId,
        userId,
      );

      expect(repository.update).toHaveBeenCalledWith(tenantId, agreementId, {
        status: AgreementStatusEnum.UNDER_REVIEW,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.submitted_for_review',
        expect.any(Object),
      );
      expect(result.status).toBe(AgreementStatusEnum.UNDER_REVIEW);
    });

    it('should transition to APPROVED and emit event', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue({
        id: agreementId,
        status: AgreementStatusEnum.APPROVED,
      } as any);

      const result = await service.approve(tenantId, agreementId, userId);

      expect(repository.update).toHaveBeenCalledWith(tenantId, agreementId, {
        status: AgreementStatusEnum.APPROVED,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.approved',
        expect.any(Object),
      );
      expect(result.status).toBe(AgreementStatusEnum.APPROVED);
    });

    it('should transition to PENDING_SIGNATURE and emit event', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue({
        id: agreementId,
        status: AgreementStatusEnum.PENDING_SIGNATURE,
      } as any);

      const result = await service.pendingSignature(tenantId, agreementId);

      expect(repository.update).toHaveBeenCalledWith(tenantId, agreementId, {
        status: AgreementStatusEnum.PENDING_SIGNATURE,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.pending_signature',
        expect.any(Object),
      );
      expect(result.status).toBe(AgreementStatusEnum.PENDING_SIGNATURE);
    });

    it('should transition to SIGNED and emit event', async () => {
      const signatureId = 'sig-1';
      jest.spyOn(repository, 'update').mockResolvedValue({
        id: agreementId,
        status: AgreementStatusEnum.SIGNED,
      } as any);

      const result = await service.markAsSigned(
        tenantId,
        agreementId,
        signatureId,
      );

      expect(repository.update).toHaveBeenCalledWith(tenantId, agreementId, {
        status: AgreementStatusEnum.SIGNED,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.signed',
        expect.any(Object),
      );
      expect(result.status).toBe(AgreementStatusEnum.SIGNED);
    });
  });
});
