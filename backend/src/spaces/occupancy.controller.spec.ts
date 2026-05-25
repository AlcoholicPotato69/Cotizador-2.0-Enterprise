import { Test, TestingModule } from '@nestjs/testing';
import { OccupancyController } from './occupancy.controller';
import { OccupancyService } from './occupancy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('OccupancyController', () => {
  let controller: OccupancyController;
  let service: OccupancyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccupancyController],
      providers: [
        {
          provide: OccupancyService,
          useValue: {
            createOccupancy: jest.fn().mockResolvedValue({ id: 'occ-1' }),
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

    controller = module.get<OccupancyController>(OccupancyController);
    service = module.get<OccupancyService>(OccupancyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create occupancy', async () => {
    const req = {
      user: { id: 'u1', tenantId: 't1', role: 'admin', permissions: [] },
    };
    const result = await controller.create(
      req as any,
      { spaceId: 's1', startTime: new Date(), endTime: new Date() } as any,
    );
    expect(result.id).toBe('occ-1');
    expect(service.createOccupancy).toHaveBeenCalledWith(expect.any(Object));
  });
});
