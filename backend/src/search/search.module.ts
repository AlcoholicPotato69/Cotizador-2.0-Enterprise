import { Module } from '@nestjs/common';
import { GlobalSearchEngineService } from './search.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SearchController } from './search.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [GlobalSearchEngineService],
  exports: [GlobalSearchEngineService],
})
export class SearchModule {}
