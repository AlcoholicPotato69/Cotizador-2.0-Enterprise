import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalsController } from './approvals.controller';
import { ApprovalsService } from './approvals.service';
import { JwtService } from '@nestjs/jwt';

describe('ApprovalsController', () => {
  let controller: ApprovalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApprovalsController],
      providers: [ApprovalsService, { provide: JwtService, useValue: {} }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TenantIsolationGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ApprovalsController>(ApprovalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
