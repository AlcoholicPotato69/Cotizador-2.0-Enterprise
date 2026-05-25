import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/auth/guards/permissions.guard';
import {
  ContractStatus,
  InvoiceStatus,
  PaymentStatus,
  Prisma,
} from '@prisma/client';

describe('Mandato 10.5 - Block 3 Engines (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'test-secret';
    process.env.JWT_SECRET = 'test-jwt-secret';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            tenantId: 'a1b2c3d4e5f6',
            id: 'user-1',
            role: 'admin',
            permissions: [
              'reports:read',
              'read:analytics',
              'read:advanced_reports',
            ],
          };
          return true;
        },
      })
      .overrideGuard(PermissionsGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideProvider(PrismaService)
      .useValue({
        $transaction: jest.fn().mockImplementation(async (cb) => {
          const tx = {
            $executeRaw: jest.fn().mockResolvedValue({}),
            $queryRaw: jest.fn().mockResolvedValue([
              {
                id: 'pay-1',
                status: 'UNDER_REVIEW',
                paymentAmount: new Prisma.Decimal(100),
                invoiceId: 'inv-1',
              },
            ]),
            invoice: {
              create: jest.fn().mockResolvedValue({
                id: 'inv-1',
                status: InvoiceStatus.DRAFT,
              }),
              update: jest.fn().mockResolvedValue({
                id: 'inv-1',
                status: InvoiceStatus.STAMPED,
              }),
              findFirst: jest.fn().mockResolvedValue({
                id: 'inv-1',
                status: InvoiceStatus.DRAFT,
              }),
              count: jest.fn().mockResolvedValue(10),
            },
            payment: {
              create: jest.fn().mockResolvedValue({
                id: 'pay-1',
                status: PaymentStatus.PENDING,
                paymentAmount: new Prisma.Decimal(100),
              }),
              findUnique: jest.fn().mockResolvedValue({
                id: 'pay-1',
                status: PaymentStatus.PENDING,
                paymentAmount: new Prisma.Decimal(100),
              }),
              findFirst: jest.fn().mockResolvedValue({
                id: 'pay-1',
                status: PaymentStatus.PENDING,
              }),
              update: jest.fn().mockResolvedValue({
                id: 'pay-1',
                status: PaymentStatus.UNDER_REVIEW,
              }),
              updateMany: jest.fn().mockResolvedValue({ count: 1 }),
              count: jest.fn().mockResolvedValue(10),
            },
            paymentEvidence: {
              findFirst: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue({ id: 'evid-1' }),
            },
            outboxEvent: {
              create: jest.fn().mockResolvedValue({ id: 'event-1' }),
            },
          };
          return await cb(tx);
        }),
        $executeRaw: jest.fn().mockResolvedValue({}),
        $queryRaw: jest.fn().mockResolvedValue([{}]),
        invoice: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'inv-1',
            status: InvoiceStatus.DRAFT,
            tenantId: 'a1b2c3d4e5f6',
          }),
          findMany: jest
            .fn()
            .mockResolvedValue([
              { id: 'inv-1', status: InvoiceStatus.DRAFT, totalAmount: 100 },
            ]),
          count: jest.fn().mockResolvedValue(10),
          aggregate: jest.fn().mockResolvedValue({
            _sum: {
              totalAmount: new Prisma.Decimal(500),
              balanceDue: new Prisma.Decimal(200),
            },
          }),
        },
        payment: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'pay-1',
            status: PaymentStatus.UNDER_REVIEW,
          }),
          findMany: jest
            .fn()
            .mockResolvedValue([{ id: 'pay-1', paymentAmount: 100 }]),
          count: jest.fn().mockResolvedValue(10),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Invoices and Payments Transactional Logic', () => {
    it('1. Create Invoice', async () => {
      const response = await request(app.getHttpServer())
        .post('/invoices/generate')
        .send({
          clientId: 'client-1',
          contractId: 'contract-1',
          totalAmount: 1000,
          currencyCode: 'USD',
        })
        .expect(201);

      expect(response.text).toBe('inv-1');
    });

    it('2. Stamp Invoice', async () => {
      const response = await request(app.getHttpServer())
        .post('/invoices/inv-1/stamp')
        .expect(201);

      expect(response.body).toHaveProperty('success');
    });

    it('3. Submit Payment', async () => {
      const response = await request(app.getHttpServer())
        .post('/payments/submit')
        .send({
          invoiceId: 'inv-1',
          paymentAmount: 1000,
          evidenceUrl: 'http://example.com/receipt.pdf',
          currencyCode: 'USD',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id', 'pay-1');
    });

    it('4. Approve Payment', async () => {
      const response = await request(app.getHttpServer())
        .post('/payments/pay-1/approve')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('5. Get Reports', async () => {
      const response = await request(app.getHttpServer())
        .get('/reports/kpis')
        .expect(200);

      expect(response.body).toHaveProperty('totalInvoices');
    });
  });
});
