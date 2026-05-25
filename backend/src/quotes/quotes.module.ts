import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesRepository } from './quotes.repository';
import { QuotesListener } from './quotes.listener';
import { QuotesController } from './quotes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [QuotesController],
  providers: [QuotesRepository, QuotesService, QuotesListener],
  exports: [QuotesRepository, QuotesService],
})
export class QuotesModule {}
