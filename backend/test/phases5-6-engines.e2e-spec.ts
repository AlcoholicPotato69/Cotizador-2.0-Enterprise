import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Phases 5 & 6 Engines (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let token: string;
  let tenantId: string;
  let userId: string;

  beforeAll(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'super-secret-document-key';
    process.env.JWT_SECRET = 'test-secret';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $transaction: jest.fn().mockImplementation(async (cb) => {
          if (typeof cb === 'function') {
            return cb({
              numberingSequence: {
                upsert: jest.fn().mockResolvedValue({
                  currentValue: 1,
                  prefix: 'QT',
                  suffix: '26',
                }),
              },
            });
          }
          return cb;
        }),
        numberingSequence: {
          upsert: jest
            .fn()
            .mockResolvedValue({ currentValue: 1, prefix: 'QT', suffix: '26' }),
        },
        tenant: { create: jest.fn().mockResolvedValue({ id: 'tenant-1' }) },
        role: {
          create: jest.fn().mockResolvedValue({ id: 'role-1', name: 'ADMIN' }),
        },
        user: {
          create: jest
            .fn()
            .mockResolvedValue({ id: 'user-1', email: 'test@test.com' }),
        },
        healthCheckMetric: {
          create: jest
            .fn()
            .mockResolvedValue({ id: 'metric-1', serviceName: 'TestService' }),
          findMany: jest
            .fn()
            .mockResolvedValue([
              { id: 'metric-1', serviceName: 'TestService' },
            ]),
        },
        storageMetadata: {
          create: jest
            .fn()
            .mockImplementation(({ data }) =>
              Promise.resolve({ id: 'test-meta-1', ...data }),
            ),
          findUnique: jest.fn().mockImplementation(({ where }) => {
            if (where.id === 'test-meta-1')
              return Promise.resolve({
                id: 'test-meta-1',
                tenantId: 'tenant-1',
                bucketName: 'test-bucket',
                fileSize: BigInt(1024),
              });
            if (where.id === 'test-meta-2')
              return Promise.resolve({
                id: 'test-meta-2',
                tenantId: 'tenant-2',
                bucketName: 'other-bucket',
                fileSize: BigInt(2048),
              });
            return Promise.resolve(null);
          }),
        },
        $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    jwtService = app.get<JwtService>(JwtService);
    tenantId = 'tenant-1';
    userId = 'user-1';
    token = jwtService.sign({
      sub: userId,
      email: 'test@test.com',
      tenantId,
      role: 'ADMIN',
      permissions: [
        'numbering:generate',
        'numbering:read',
        'health:read',
        'health:metrics',
        'storage:read',
      ],
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Numbering Engine', () => {
    it('POST /numbering/generate should create and return a folio', async () => {
      const response = await request(app.getHttpServer())
        .post('/numbering/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          tenantId,
          entityType: 'QUOTE',
          prefix: 'QT',
          suffix: '26',
        })
        .expect(201);

      expect(response.body).toHaveProperty('folio');
      expect(response.body.folio).toBe('QT-000001-26');
    });
  });

  describe('Health Engine', () => {
    it('GET /health should return system status', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('UP');
      expect(response.body.database_status).toBe('OPERATIONAL');
    });

    it('GET /health/metrics should return metrics array', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/metrics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].serviceName).toBe('TestService');
    });
  });

  describe('Storage Engine', () => {
    it('GET /storage/:id should return metadata for isolated tenant', async () => {
      const response = await request(app.getHttpServer())
        .get(`/storage/test-meta-1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toBe('test-meta-1');
      expect(response.body.bucketName).toBe('test-bucket');
    });

    it('GET /storage/:id should fail if cross-tenant', async () => {
      await request(app.getHttpServer())
        .get(`/storage/test-meta-2`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
