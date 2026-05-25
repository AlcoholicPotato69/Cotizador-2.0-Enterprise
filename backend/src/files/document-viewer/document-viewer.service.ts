import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ClientFileRepository } from '../client-file/client-file.repository';
import { QuoteFileRepository } from '../quote-file/quote-file.repository';
import { ContractFileRepository } from '../contract-file/contract-file.repository';
import { AgreementFileRepository } from '../agreement-file/agreement-file.repository';
import { FinancialFileRepository } from '../financial-file/financial-file.repository';

@Injectable()
export class DocumentViewerService {
  private readonly secretKey: string;

  constructor(
    private readonly clientFileRepo: ClientFileRepository,
    private readonly quoteFileRepo: QuoteFileRepository,
    private readonly contractFileRepo: ContractFileRepository,
    private readonly agreementFileRepo: AgreementFileRepository,
    private readonly financialFileRepo: FinancialFileRepository,
  ) {
    const secret = process.env.DOCUMENT_SIGNING_SECRET;
    if (!secret) {
      throw new Error(
        'CRITICAL_ERROR: DOCUMENT_SIGNING_SECRET is not defined in the environment. Hardcoded fallback blocked by forensic audit.',
      );
    }
    this.secretKey = secret;
  }

  generateSignedUrl(
    tenantId: string,
    entityType: string,
    fileId: string,
    expiresInMinutes = 60,
  ): string {
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    const payload = `${tenantId}:${entityType}:${fileId}:${expiresAt}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(payload)
      .digest('hex');

    return `/document-viewer/view?tenantId=${tenantId}&entityType=${entityType}&fileId=${fileId}&expiresAt=${expiresAt}&signature=${signature}`;
  }

  async viewDocument(
    tenantId: string,
    entityType: string,
    fileId: string,
    expiresAt: number,
    signature: string,
  ) {
    if (Date.now() > expiresAt) {
      throw new UnauthorizedException('Signed URL has expired');
    }

    const payload = `${tenantId}:${entityType}:${fileId}:${expiresAt}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(payload)
      .digest('hex');

    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      throw new ForbiddenException('Invalid document signature');
    }

    let url: string | undefined;

    switch (entityType) {
      case 'client':
        const clientDoc = await this.clientFileRepo.findClientFileDocumentById(
          tenantId,
          fileId,
        );
        url = clientDoc?.url;
        break;
      case 'quote':
        const quoteFile = await this.quoteFileRepo.findQuoteFileById(
          tenantId,
          fileId,
        );
        url = quoteFile?.url;
        break;
      case 'contract':
        const contractFile = await this.contractFileRepo.findContractFileById(
          tenantId,
          fileId,
        );
        url = contractFile?.url;
        break;
      case 'agreement':
        const agreementFile =
          await this.agreementFileRepo.findAgreementFileById(tenantId, fileId);
        url = agreementFile?.url;
        break;
      case 'financial':
        const financialFile =
          await this.financialFileRepo.findFinancialFileById(tenantId, fileId);
        url = financialFile?.url;
        break;
      default:
        throw new NotFoundException('Unsupported entity type');
    }

    if (!url) {
      throw new NotFoundException('Document not found');
    }

    return { url };
  }
}
