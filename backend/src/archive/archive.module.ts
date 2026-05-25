import { Module } from '@nestjs/common';
import { ArchiveEngineService } from './archive.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ArchiveController } from './archive.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ArchiveController],
  providers: [ArchiveEngineService],
  exports: [ArchiveEngineService],
})
export class ArchiveModule {}
