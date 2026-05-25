import { Module } from '@nestjs/common';

// Client File Engine
import { ClientFileRepository } from './client-file/client-file.repository';
import { ClientFileService } from './client-file/client-file.service';
import { ClientFileController } from './client-file/client-file.controller';

// Quote File Engine
import { QuoteFileRepository } from './quote-file/quote-file.repository';
import { QuoteFileService } from './quote-file/quote-file.service';
import { QuoteFileController } from './quote-file/quote-file.controller';

// Contract File Engine
import { ContractFileRepository } from './contract-file/contract-file.repository';
import { ContractFileService } from './contract-file/contract-file.service';
import { ContractFileController } from './contract-file/contract-file.controller';

// Agreement File Engine
import { AgreementFileRepository } from './agreement-file/agreement-file.repository';
import { AgreementFileService } from './agreement-file/agreement-file.service';
import { AgreementFileController } from './agreement-file/agreement-file.controller';

// Financial File Engine
import { FinancialFileRepository } from './financial-file/financial-file.repository';
import { FinancialFileService } from './financial-file/financial-file.service';
import { FinancialFileController } from './financial-file/financial-file.controller';

// Document Viewer Engine
import { DocumentViewerService } from './document-viewer/document-viewer.service';
import { DocumentViewerController } from './document-viewer/document-viewer.controller';

@Module({
  imports: [],
  controllers: [
    ClientFileController,
    QuoteFileController,
    ContractFileController,
    AgreementFileController,
    FinancialFileController,
    DocumentViewerController,
  ],
  providers: [
    ClientFileRepository,
    ClientFileService,
    QuoteFileRepository,
    QuoteFileService,
    ContractFileRepository,
    ContractFileService,
    AgreementFileRepository,
    AgreementFileService,
    FinancialFileRepository,
    FinancialFileService,
    DocumentViewerService,
  ],
  exports: [
    ClientFileService,
    QuoteFileService,
    ContractFileService,
    AgreementFileService,
    FinancialFileService,
    DocumentViewerService,
  ],
})
export class FilesModule {}
