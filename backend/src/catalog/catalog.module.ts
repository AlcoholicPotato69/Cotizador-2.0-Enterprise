import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogRepository } from './catalog.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CatalogController],
  providers: [CatalogService, CatalogRepository],
  exports: [CatalogService, CatalogRepository],
})
export class CatalogModule {}
