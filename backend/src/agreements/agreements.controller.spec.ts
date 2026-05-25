import { Test, TestingModule } from '@nestjs/testing';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('AgreementsController', () => {
  let controller: AgreementsController;
  let service: AgreementsService;

  beforeEach(async () => {
    const mockAgreementsService = {
      create: jest.fn(),
      submitForReview: jest.fn(),
      approve: jest.fn(),
      generateLetter: jest.fn(),
      pendingSignature: jest.fn(),
      markAsSigned: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgreementsController],
      providers: [
        { provide: AgreementsService, useValue: mockAgreementsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AgreementsController>(AgreementsController);
    service = module.get<AgreementsService>(AgreementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an agreement', async () => {
    const mockUser = { id: 'user-1', tenantId: 'tenant-1' };
    const mockDto = { clientId: 'client-1', type: 'NDA' } as any;
    jest.spyOn(service, 'create').mockResolvedValue({ id: 'ag-1' } as any);

    const result = await controller.create(mockUser, mockDto);
    expect(service.create).toHaveBeenCalledWith(
      mockUser.tenantId,
      mockDto,
      mockUser.id,
    );
    expect(result).toEqual({ id: 'ag-1' });
  });

  it('should approve an agreement', async () => {
    const mockUser = { id: 'user-1', tenantId: 'tenant-1' };
    const id = 'ag-1';
    jest
      .spyOn(service, 'approve')
      .mockResolvedValue({ id, status: 'APPROVED' } as any);

    const result = await controller.approve(mockUser, id);
    expect(service.approve).toHaveBeenCalledWith(
      mockUser.tenantId,
      id,
      mockUser.id,
    );
    expect(result).toEqual({ id, status: 'APPROVED' });
  });
});
