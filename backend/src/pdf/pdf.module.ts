import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfListener } from './pdf.listener';

@Module({
  providers: [PdfService, PdfListener],
  exports: [PdfService],
})
export class PdfModule {}
