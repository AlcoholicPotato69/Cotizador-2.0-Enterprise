import { Test, TestingModule } from '@nestjs/testing';
import { SpaceConfigurationController } from './space-configuration.controller';
import { SpaceConfigurationService } from './space-configuration.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';

describe('SpaceConfigurationController', () => {
  let controller: SpaceConfigurationController;
  let service: SpaceConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceConfigurationController],
      providers: [
        {
          provide: SpaceConfigurationService,
          useValue: {
            setConfiguration: jest.fn().mockResolvedValue({ id: 'conf-1' }),
            createRule: jest.fn().mockResolvedValue({ id: 'rule-1' }),
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

    controller = module.get<SpaceConfigurationController>(
      SpaceConfigurationController,
    );
    service = module.get<SpaceConfigurationService>(SpaceConfigurationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call setConfiguration', async () => {
    const req = {
      user: { id: 'u1', tenantId: 't1', role: 'admin', permissions: [] },
    };
    const result = await controller.setConfiguration(
      req as any,
      { spaceId: 's1', configKey: 'k', configValue: 'v' } as any,
    );
    expect(result.id).toBe('conf-1');
  });

  it('should call createRule', async () => {
    const req = {
      user: { id: 'u1', tenantId: 't1', role: 'admin', permissions: [] },
    };
    const result = await controller.createRule(
      req as any,
      { spaceId: 's1', ruleType: 'a', configuration: {} } as any,
    );
    expect(result.id).toBe('rule-1');
  });
});
