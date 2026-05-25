import { Test, TestingModule } from '@nestjs/testing';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';

describe('AgendaController', () => {
  let controller: AgendaController;
  let service: AgendaService;

  const mockAgendaService = {
    reserve: jest.fn(),
    reschedule: jest.fn(),
    release: jest.fn(),
    cancel: jest.fn(),
    expire: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgendaController],
      providers: [{ provide: AgendaService, useValue: mockAgendaService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TenantIsolationGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AgendaController>(AgendaController);
    service = module.get<AgendaService>(AgendaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call reserve', async () => {
    mockAgendaService.reserve.mockResolvedValue({ id: 'res1' });
    const dto: CreateReservationDto = {
      spaceId: '1',
      startTime: '2026-05-24T10:00:00Z',
      endTime: '2026-05-24T11:00:00Z',
    };
    const mockReq = {
      user: { tenantId: 'tenant1', id: 'user1', role: 'admin' },
    };
    await expect(controller.reserve(dto, mockReq)).resolves.toEqual({
      id: 'res1',
    });
    expect(service.reserve).toHaveBeenCalledWith(dto);
  });

  it('should call reschedule', async () => {
    mockAgendaService.reschedule.mockResolvedValue({ id: 'res1' });
    const mockReq = {
      user: { tenantId: 'tenant1', id: 'user1', role: 'admin' },
    };
    await expect(
      controller.reschedule(
        'res1',
        { startTime: '2026-05-24T12:00:00Z', endTime: '2026-05-24T13:00:00Z' },
        mockReq,
      ),
    ).resolves.toEqual({ id: 'res1' });
    expect(service.reschedule).toHaveBeenCalledWith('res1', {
      startTime: '2026-05-24T12:00:00Z',
      endTime: '2026-05-24T13:00:00Z',
    });
  });

  it('should call release', async () => {
    mockAgendaService.release.mockResolvedValue({ id: 'res1' });
    const mockReq = {
      user: { tenantId: 'tenant1', id: 'user1', role: 'admin' },
    };
    await expect(controller.release('res1', mockReq)).resolves.toEqual({
      id: 'res1',
    });
    expect(service.release).toHaveBeenCalledWith('res1');
  });

  it('should call cancel', async () => {
    mockAgendaService.cancel.mockResolvedValue({ id: 'res1' });
    const mockReq = {
      user: { tenantId: 'tenant1', id: 'user1', role: 'admin' },
    };
    await expect(controller.cancel('res1', mockReq)).resolves.toEqual({
      id: 'res1',
    });
    expect(service.cancel).toHaveBeenCalledWith('res1');
  });

  it('should call expire', async () => {
    mockAgendaService.expire.mockResolvedValue({ id: 'res1' });
    const mockReq = {
      user: { tenantId: 'tenant1', id: 'user1', role: 'admin' },
    };
    await expect(controller.expire('res1', mockReq)).resolves.toEqual({
      id: 'res1',
    });
    expect(service.expire).toHaveBeenCalledWith('res1');
  });
});
