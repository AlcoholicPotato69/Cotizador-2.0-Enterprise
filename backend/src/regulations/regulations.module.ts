import { Module } from '@nestjs/common';
import { RegulationsService } from './regulations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RegulationsController } from './regulations.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RegulationsController],
  providers: [RegulationsService],
  exports: [RegulationsService],
})
export class RegulationsModule {}
