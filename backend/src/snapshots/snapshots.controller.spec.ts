import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantIsolationGuard } from '../auth/guards/tenant-isolation.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotsController } from './snapshots.controller';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsRepository } from './snapshots.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';

describe('SnapshotsController', () => {
  let controller: SnapshotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnapshotsController],
      providers: [
        SnapshotsService,
        { provide: SnapshotsRepository, useValue: {} },
        { provide: DomainEventPublisher, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TenantIsolationGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SnapshotsController>(SnapshotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
