import { Module } from '@nestjs/common';
import { DocumentsRepository } from './documents.repository';
import { DocumentPolicyService } from './document-policy.service';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [PrismaModule, PdfModule],
  controllers: [DocumentsController],
  providers: [DocumentsRepository, DocumentPolicyService, DocumentsService],
  exports: [DocumentsRepository, DocumentPolicyService, DocumentsService],
})
export class DocumentsModule {}
