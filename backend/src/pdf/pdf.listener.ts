import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PdfService } from './pdf.service';
import { tenantContext } from '../prisma/tenant-context';

@Injectable()
export class PdfListener {
  private readonly logger = new Logger(PdfListener.name);

  constructor(private readonly pdfService: PdfService) {}

  @OnEvent('contract.generated', { async: true })
  async handleContractGenerated(event: any) {
    if (!event || !event.tenantId || !event.payload) return;

    tenantContext.run(
      { tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' },
      async () => {
        try {
          this.logger.log(
            `Contract generated event received. Generating PDF...`,
          );
          await this.pdfService.generatePdfFromView({
            tenantId: event.tenantId,
            templateName: 'contract-template',
            context: { contractId: event.payload.contractId },
            outputFileName: `contract-${event.payload.contractId}.pdf`,
          });
        } catch (error) {
          this.logger.error(
            `Error generating PDF for contract: ${error.message}`,
            error.stack,
          );
        }
      },
    );
  }

  @OnEvent('agreement.approved', { async: true })
  async handleAgreementApproved(event: any) {
    if (!event || !event.tenantId || !event.agreementId) return;

    tenantContext.run(
      { tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' },
      async () => {
        try {
          this.logger.log(
            `Agreement approved event received. Generating PDF...`,
          );
          await this.pdfService.generatePdfFromView({
            tenantId: event.tenantId,
            templateName: 'agreement-template',
            context: { agreementId: event.agreementId },
            outputFileName: `agreement-${event.agreementId}.pdf`,
          });
        } catch (error) {
          this.logger.error(
            `Error generating PDF for agreement: ${error.message}`,
            error.stack,
          );
        }
      },
    );
  }
}
