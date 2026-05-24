import { Module } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsRepository } from './snapshots.repository';
import { SnapshotsListener } from './snapshots.listener';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SnapshotsRepository, SnapshotsService, SnapshotsListener],
  exports: [SnapshotsRepository, SnapshotsService],
})
export class SnapshotsModule {}
