import { Module } from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { AgreementsController } from './agreements.controller';
import { AgreementsRepository } from './agreements.repository';
import { AgreementsListener } from './agreements.listener';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AgreementsController],
  providers: [AgreementsService, AgreementsRepository, AgreementsListener],
  exports: [AgreementsService, AgreementsRepository],
})
export class AgreementsModule {}
