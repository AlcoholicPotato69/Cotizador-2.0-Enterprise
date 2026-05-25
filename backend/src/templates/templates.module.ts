import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TemplatesController } from './templates.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
