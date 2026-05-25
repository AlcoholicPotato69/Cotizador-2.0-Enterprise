import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerCreditsController } from './customer-credits.controller';
import { JwtService } from '@nestjs/jwt';

import { CustomerCreditsService } from './customer-credits.service';

describe('CustomerCreditsController', () => {
  let controller: CustomerCreditsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerCreditsController],
      providers: [
        { provide: CustomerCreditsService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TenantIsolationGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CustomerCreditsController>(
      CustomerCreditsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
