import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { tenantContext } from '../prisma/tenant-context';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 'client-1' }),
            findById: jest.fn().mockResolvedValue({ id: 'client-1' }),
            update: jest.fn().mockResolvedValue({ id: 'client-1' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a client', async () => {
    const req = { user: { id: 'u1', tenantId: 't1', role: 'admin' } } as any;
    await expect(controller.create(req, { name: 'Test' })).resolves.toEqual({
      id: 'client-1',
    });
    expect(service.create).toHaveBeenCalledWith({ name: 'Test' });
  });

  it('should find a client', async () => {
    const req = { user: { id: 'u1', tenantId: 't1', role: 'admin' } } as any;
    await expect(controller.findById(req, 'client-1')).resolves.toEqual({
      id: 'client-1',
    });
    expect(service.findById).toHaveBeenCalledWith('client-1');
  });

  it('should update a client', async () => {
    const req = { user: { id: 'u1', tenantId: 't1', role: 'admin' } } as any;
    await expect(
      controller.update(req, 'client-1', { name: 'Test2' }),
    ).resolves.toEqual({ id: 'client-1' });
    expect(service.update).toHaveBeenCalledWith('client-1', { name: 'Test2' });
  });
});
