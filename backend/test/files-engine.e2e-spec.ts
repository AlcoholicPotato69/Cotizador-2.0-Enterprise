import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import * as crypto from 'crypto';
import { ClientFileRepository } from '../src/files/client-file/client-file.repository';
import { QuoteFileRepository } from '../src/files/quote-file/quote-file.repository';
import { ContractFileRepository } from '../src/files/contract-file/contract-file.repository';
import { FinancialFileRepository } from '../src/files/financial-file/financial-file.repository';
import { FilesModule } from '../src/files/files.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';

describe('Files Engine (e2e)', () => {
  let app: INestApplication;

  const mockUser = {
    id: 'user-1',
    tenantId: 'tenant-1',
    role: 'admin',
    email: 'admin@example.com',
    permissions: [
      'client-files:write',
      'client-files:read',
      'quote-files:write',
      'quote-files:read',
      'contract-files:write',
      'contract-files:read',
      'financial-files:write',
      'financial-files:read',
      'document-viewer:read',
      'documents:share',
    ],
  };

  beforeAll(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'super-secret-document-key';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot(), PrismaModule, FilesModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ClientFile Engine', () => {
    it('/client-files (POST) - create', async () => {
      // We will mock the repository method to bypass Prisma errors
      const clientRepo = app.get(ClientFileRepository);
      jest.spyOn(clientRepo, 'createClientFile').mockResolvedValue({
        id: 'file-1',
        tenantId: 'tenant-1',
        clientId: 'client-1',
        name: 'File 1',
      } as any);

      return request(app.getHttpServer())
        .post('/client-files')
        .send({ clientId: 'client-1', name: 'File 1' })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('file-1');
          expect(res.body.tenantId).toBe('tenant-1');
        });
    });

    it('/client-files/client/:clientId (GET)', async () => {
      const clientRepo = app.get(ClientFileRepository);
      jest
        .spyOn(clientRepo, 'findClientFiles')
        .mockResolvedValue([{ id: 'file-1' } as any]);

      return request(app.getHttpServer())
        .get('/client-files/client/client-1')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
        });
    });
  });

  describe('QuoteFile Engine', () => {
    it('/quote-files (POST) - create', async () => {
      const quoteRepo = app.get(QuoteFileRepository);
      jest.spyOn(quoteRepo, 'createQuoteFile').mockResolvedValue({
        id: 'qfile-1',
        tenantId: 'tenant-1',
        quoteId: 'quote-1',
        url: 'http://test',
      } as any);

      return request(app.getHttpServer())
        .post('/quote-files')
        .send({ quoteId: 'quote-1', url: 'http://test' })
        .expect(201);
    });

    it('/quote-files/quote/:quoteId (GET)', async () => {
      const quoteRepo = app.get(QuoteFileRepository);
      jest
        .spyOn(quoteRepo, 'findQuoteFiles')
        .mockResolvedValue([{ id: 'qfile-1' } as any]);

      return request(app.getHttpServer())
        .get('/quote-files/quote/quote-1')
        .expect(200);
    });
  });

  describe('ContractFile Engine', () => {
    it('/contract-files (POST) - create', async () => {
      const repo = app.get(ContractFileRepository);
      jest.spyOn(repo, 'createContractFile').mockResolvedValue({
        id: 'cfile-1',
        tenantId: 'tenant-1',
        contractId: 'contract-1',
        url: 'http://test',
      } as any);

      return request(app.getHttpServer())
        .post('/contract-files')
        .send({ contractId: 'contract-1', url: 'http://test' })
        .expect(201);
    });

    it('/contract-files/contract/:contractId (GET)', async () => {
      const repo = app.get(ContractFileRepository);
      jest
        .spyOn(repo, 'findContractFiles')
        .mockResolvedValue([{ id: 'cfile-1' } as any]);

      return request(app.getHttpServer())
        .get('/contract-files/contract/contract-1')
        .expect(200);
    });
  });

  describe('FinancialFile Engine', () => {
    it('/financial-files (POST) - create', async () => {
      const repo = app.get(FinancialFileRepository);
      jest.spyOn(repo, 'createFinancialFile').mockResolvedValue({
        id: 'ffile-1',
        tenantId: 'tenant-1',
        invoiceId: 'invoice-1',
        url: 'http://test',
      } as any);

      return request(app.getHttpServer())
        .post('/financial-files')
        .send({ invoiceId: 'invoice-1', url: 'http://test' })
        .expect(201);
    });

    it('/financial-files/invoice/:invoiceId (GET)', async () => {
      const repo = app.get(FinancialFileRepository);
      jest
        .spyOn(repo, 'findFinancialFiles')
        .mockResolvedValue([{ id: 'ffile-1' } as any]);

      return request(app.getHttpServer())
        .get('/financial-files/invoice/invoice-1')
        .expect(200);
    });
  });

  describe('Document Viewer Engine', () => {
    it('/document-viewer/generate-url (GET) - generates HMAC signed URL', async () => {
      return request(app.getHttpServer())
        .get('/document-viewer/generate-url?entityType=client&fileId=doc-1')
        .expect(200)
        .expect((res) => {
          expect(res.body.url).toContain('signature=');
          expect(res.body.url).toContain('expiresAt=');
        });
    });

    it('/document-viewer/view (GET) - redirects if signature is valid', async () => {
      const secret =
        process.env.DOCUMENT_SIGNING_SECRET || 'super-secret-document-key';
      const tenantId = 'tenant-1';
      const entityType = 'client';
      const fileId = 'doc-1';
      const expiresAt = Date.now() + 60000;
      const payload = `${tenantId}:${entityType}:${fileId}:${expiresAt}`;
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const clientRepo = app.get(ClientFileRepository);
      jest
        .spyOn(clientRepo, 'findClientFileDocumentById')
        .mockResolvedValue({ url: 'http://actual-document-url.com' } as any);

      return request(app.getHttpServer())
        .get(
          `/document-viewer/view?tenantId=${tenantId}&entityType=${entityType}&fileId=${fileId}&expiresAt=${expiresAt}&signature=${signature}`,
        )
        .expect(302)
        .expect('Location', 'http://actual-document-url.com');
    });

    it('/document-viewer/view (GET) - 403 if signature is invalid', async () => {
      return request(app.getHttpServer())
        .get(
          `/document-viewer/view?tenantId=tenant-1&entityType=client&fileId=doc-1&expiresAt=${Date.now() + 60000}&signature=invalid`,
        )
        .expect(403);
    });

    it('/document-viewer/view (GET) - 401 if URL is expired', async () => {
      return request(app.getHttpServer())
        .get(
          `/document-viewer/view?tenantId=tenant-1&entityType=client&fileId=doc-1&expiresAt=${Date.now() - 60000}&signature=doesn-matter`,
        )
        .expect(401);
    });
  });
});
