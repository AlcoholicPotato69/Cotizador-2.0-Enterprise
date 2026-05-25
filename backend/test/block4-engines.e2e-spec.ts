import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Block 4 Engines (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let token: string;
  const tenantId = 't-block4-e2e';
  let clientId: string;
  let docId: string;

  beforeAll(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'super-secret';
    process.env.JWT_SECRET = 'super-secret-jwt';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $queryRaw: jest.fn().mockResolvedValue([
          {
            id: 'snap-1',
            entity_type: 'Client',
            payload: { name: 'Block4' },
          },
        ]),
        invoice: {
          count: jest.fn().mockResolvedValue(2),
          aggregate: jest.fn().mockResolvedValue({
            _sum: {
              totalAmount: { toNumber: () => 1500.5 },
              balanceDue: { toNumber: () => 1000 },
            },
          }),
          groupBy: jest.fn().mockResolvedValue([
            {
              status: 'PAID',
              _count: { id: 1 },
              _sum: { totalAmount: { toNumber: () => 1500.5 } },
            },
          ]),
        },
        quote: {
          groupBy: jest.fn().mockResolvedValue([
            {
              status: 'DRAFT',
              _count: { id: 1 },
              _sum: { totalAmount: { toNumber: () => 500 } },
            },
          ]),
        },
        client: {
          groupBy: jest
            .fn()
            .mockResolvedValue([{ status: 'ACTIVE', _count: { id: 1 } }]),
          findFirst: jest
            .fn()
            .mockResolvedValue({ id: 'c1', status: 'ACTIVE' }),
          update: jest.fn().mockResolvedValue({
            id: 'c1',
            status: 'ARCHIVED',
            deletedAt: new Date(),
          }),
          findUnique: jest.fn().mockResolvedValue({
            id: 'c1',
            status: 'ARCHIVED',
            deletedAt: new Date(),
          }),
        },
        document: {
          findMany: jest.fn().mockResolvedValue([{ id: 'd1' }]),
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
          findUnique: jest.fn().mockResolvedValue({
            id: 'd1',
            deletedAt: new Date(),
            deletedBy: 'SYSTEM_RETENTION_POLICY',
          }),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwt = app.get<JwtService>(JwtService);

    token = jwt.sign({
      sub: 'user-1',
      email: 'test@e2e.com',
      tenantId,
      role: 'ADMIN',
      permissions: [
        'read:search',
        'read:analytics',
        'read:advanced_reports',
        'archive:entity',
        'write:archive',
      ],
    });

    clientId = 'c1';
    docId = 'd1';
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/search (GET) - Global Search', async () => {
    const res = await request(app.getHttpServer())
      .get('/search?q=Block4')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    // At least one result because of the snapshot we inserted
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].entity_type).toBe('Client');
  });

  it('/reports/kpis (GET) - Analytics Data', async () => {
    const res = await request(app.getHttpServer())
      .get('/reports/kpis')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('totalInvoices');
    expect(res.body).toHaveProperty('totalRevenue');
    expect(res.body).toHaveProperty('pendingBalance');
    expect(res.body.totalInvoices).toBeGreaterThanOrEqual(2);
  });

  it('/reports/advanced (GET) - Advanced Reporting Data', async () => {
    const res = await request(app.getHttpServer())
      .get('/reports/advanced')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty(
      'reportType',
      'ADVANCED_AGGREGATED_METRICS',
    );
    expect(res.body).toHaveProperty('metrics');
    expect(res.body.metrics).toHaveProperty('invoices');
    expect(res.body.metrics).toHaveProperty('quotes');
    expect(res.body.metrics).toHaveProperty('clients');
    expect(Array.isArray(res.body.metrics.invoices)).toBe(true);
  });

  it('/archive/entity/:model/:id (POST) - Archive Client logically', async () => {
    await request(app.getHttpServer())
      .post(`/archive/entity/Client/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201); // NestJS POST default is 201

    const updatedClient = await prisma.client.findUnique({
      where: { id: clientId },
    });
    expect(updatedClient.status).toBe('ARCHIVED');
    expect(updatedClient.deletedAt).not.toBeNull();
  });

  it('/archive/simulate-retention (POST) - Archive Engine Retention Policies', async () => {
    await request(app.getHttpServer())
      .post('/archive/simulate-retention')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const doc = await prisma.document.findUnique({ where: { id: docId } });
    expect(doc.deletedAt).not.toBeNull();
    expect(doc.deletedBy).toBe('SYSTEM_RETENTION_POLICY');
  });
});
