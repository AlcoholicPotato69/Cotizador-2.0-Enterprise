import { Test, TestingModule } from '@nestjs/testing';
import { DocumentViewerService } from './document-viewer.service';
import { ClientFileRepository } from '../client-file/client-file.repository';
import { QuoteFileRepository } from '../quote-file/quote-file.repository';
import { ContractFileRepository } from '../contract-file/contract-file.repository';
import { FinancialFileRepository } from '../financial-file/financial-file.repository';
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { AgreementFileRepository } from '../agreement-file/agreement-file.repository';

describe('DocumentViewerService', () => {
  let service: DocumentViewerService;
  let clientRepo: jest.Mocked<ClientFileRepository>;
  let quoteRepo: jest.Mocked<QuoteFileRepository>;
  let contractRepo: jest.Mocked<ContractFileRepository>;
  let financialRepo: jest.Mocked<FinancialFileRepository>;

  beforeEach(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'super-secret-document-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentViewerService,
        {
          provide: ClientFileRepository,
          useValue: { findClientFileDocumentById: jest.fn() },
        },
        {
          provide: QuoteFileRepository,
          useValue: { findQuoteFileById: jest.fn() },
        },
        {
          provide: ContractFileRepository,
          useValue: { findContractFileById: jest.fn() },
        },
        {
          provide: FinancialFileRepository,
          useValue: { findFinancialFileById: jest.fn() },
        },
        { provide: AgreementFileRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<DocumentViewerService>(DocumentViewerService);
    clientRepo = module.get(ClientFileRepository);
    quoteRepo = module.get(QuoteFileRepository);
    contractRepo = module.get(ContractFileRepository);
    financialRepo = module.get(FinancialFileRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSignedUrl', () => {
    it('should generate a valid signed URL', () => {
      const url = service.generateSignedUrl('tenant-1', 'client', 'file-1');
      expect(url).toContain(
        '/document-viewer/view?tenantId=tenant-1&entityType=client&fileId=file-1',
      );
      expect(url).toContain('&expiresAt=');
      expect(url).toContain('&signature=');
    });
  });

  describe('viewDocument', () => {
    const tenantId = 'tenant-1';
    const entityType = 'client';
    const fileId = 'file-1';
    const secret =
      process.env.DOCUMENT_SIGNING_SECRET || 'super-secret-document-key';

    it('should throw UnauthorizedException if URL expired', async () => {
      const expiresAt = Date.now() - 1000;
      await expect(
        service.viewDocument(
          tenantId,
          entityType,
          fileId,
          expiresAt,
          'invalid',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException on invalid signature', async () => {
      const expiresAt = Date.now() + 10000;
      await expect(
        service.viewDocument(
          tenantId,
          entityType,
          fileId,
          expiresAt,
          'bad-sig',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return URL for valid client document', async () => {
      const expiresAt = Date.now() + 10000;
      const payload = `${tenantId}:${entityType}:${fileId}:${expiresAt}`;
      const signature = crypto
        .createHmac('sha256', (service as any).secretKey)
        .update(payload)
        .digest('hex');

      clientRepo.findClientFileDocumentById.mockResolvedValue({
        url: 'http://doc',
      } as any);

      const result = await service.viewDocument(
        tenantId,
        entityType,
        fileId,
        expiresAt,
        signature,
      );
      expect(result).toEqual({ url: 'http://doc' });
    });

    it('should throw NotFoundException if document not found', async () => {
      const expiresAt = Date.now() + 10000;
      const payload = `${tenantId}:${entityType}:${fileId}:${expiresAt}`;
      const signature = crypto
        .createHmac('sha256', (service as any).secretKey)
        .update(payload)
        .digest('hex');

      clientRepo.findClientFileDocumentById.mockResolvedValue(null);

      await expect(
        service.viewDocument(
          tenantId,
          entityType,
          fileId,
          expiresAt,
          signature,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
