import { Test, TestingModule } from '@nestjs/testing';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('SpacesController', () => {
  let controller: SpacesController;
  let service: SpacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpacesController],
      providers: [
        {
          provide: SpacesService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 'space-1' }),
            findById: jest.fn().mockResolvedValue({ id: 'space-1' }),
            update: jest.fn().mockResolvedValue({ id: 'space-1' }),
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

    controller = module.get<SpacesController>(SpacesController);
    service = module.get<SpacesService>(SpacesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create space', async () => {
    const req = {
      user: { id: 'u1', tenantId: 't1', role: 'admin', permissions: [] },
    };
    const result = await controller.create(
      req as any,
      { name: 'Space 1' } as any,
    );
    expect(result.id).toBe('space-1');
    expect(service.create).toHaveBeenCalledWith({ name: 'Space 1' });
  });

  it('should call findById', async () => {
    const req = {
      user: { id: 'u1', tenantId: 't1', role: 'admin', permissions: [] },
    };
    const result = await controller.findById(req as any, 'space-1');
    expect(result.id).toBe('space-1');
    expect(service.findById).toHaveBeenCalledWith('space-1');
  });

  it('should call update space', async () => {
    const req = {
      user: { id: 'u1', tenantId: 't1', role: 'admin', permissions: [] },
    };
    const result = await controller.update(req as any, 'space-1', {
      name: 'New Name',
    });
    expect(result.id).toBe('space-1');
    expect(service.update).toHaveBeenCalledWith('space-1', {
      name: 'New Name',
    });
  });
});
