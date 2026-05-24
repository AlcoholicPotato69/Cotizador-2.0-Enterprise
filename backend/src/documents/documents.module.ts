import { Module } from '@nestjs/common';
import { DocumentsRepository } from './documents.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DocumentsRepository],
  exports: [DocumentsRepository],
})
export class DocumentsModule {}
