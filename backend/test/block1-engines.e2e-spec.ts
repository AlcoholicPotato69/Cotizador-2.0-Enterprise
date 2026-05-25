import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
const req = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { PermissionsGuard } from '../src/auth/guards/permissions.guard';

describe('Block 1 Engines (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'test-secret';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $transaction: jest.fn().mockImplementation(async (cb) => {
          const tx = {
            $executeRaw: jest.fn().mockResolvedValue({}),
            client: {
              create: jest
                .fn()
                .mockResolvedValue({ id: 'client-1', name: 'Test Client' }),
              findFirst: jest.fn().mockResolvedValue({ id: 'client-1' }),
            },
            catalogItem: {
              create: jest
                .fn()
                .mockResolvedValue({ id: 'item-1', name: 'Test Item' }),
              findFirst: jest.fn().mockResolvedValue({ id: 'item-1' }),
            },
            catalogPrice: {
              create: jest.fn().mockResolvedValue({ id: 'price-1' }),
            },
            catalogCategory: {
              findFirst: jest.fn().mockResolvedValue({ id: 'cat-1' }),
            },
            space: {
              create: jest.fn().mockResolvedValue({ id: 'space-1' }),
              findFirst: jest.fn().mockResolvedValue({ id: 'space-1' }),
              update: jest.fn().mockResolvedValue({ id: 'space-1' }),
            },
            spaceConfiguration: {
              create: jest.fn().mockResolvedValue({ id: 'cfg-1' }),
            },
            quote: {
              create: jest
                .fn()
                .mockResolvedValue({ id: 'quote-1', status: 'DRAFT' }),
            },
            spaceOccupancy: {
              create: jest.fn().mockResolvedValue({ id: 'occ-1' }),
              findFirst: jest.fn().mockResolvedValue(null),
            },
            auditLog: { findFirst: jest.fn().mockResolvedValue({}) },
          };
          return await cb(tx);
        }),
        client: {
          create: jest
            .fn()
            .mockResolvedValue({ id: 'client-1', name: 'Test Client' }),
          findFirst: jest.fn().mockResolvedValue({ id: 'client-1' }),
        },
        catalogItem: {
          create: jest
            .fn()
            .mockResolvedValue({ id: 'item-1', name: 'Test Item' }),
          findFirst: jest.fn().mockResolvedValue({ id: 'item-1' }),
        },
        quote: {
          create: jest
            .fn()
            .mockResolvedValue({ id: 'quote-1', status: 'DRAFT' }),
        },
        space: {
          create: jest.fn().mockResolvedValue({ id: 'space-1' }),
          findFirst: jest.fn().mockResolvedValue({ id: 'space-1' }),
          update: jest.fn().mockResolvedValue({ id: 'space-1' }),
        },
        spaceOccupancy: {
          create: jest.fn().mockResolvedValue({ id: 'occ-1' }),
          findFirst: jest.fn().mockResolvedValue(null),
        },
        auditLog: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 'audit-1' }),
        },
        snapshot: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 'snap-1' }),
        },
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            id: 'user-1',
            tenantId: 'tenant-1',
            role: 'admin',
            permissions: [
              'catalog:write',
              'spaces:config:write',
              'spaces:rules:write',
              'space:write',
              'space:read',
              'occupancy:write',
            ],
          };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Clients Engine', () => {
    it('/clients (POST) - creates a client', () => {
      return req(app.getHttpServer())
        .post('/clients')
        .send({ name: 'Test Client', email: 'test@example.com' })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('client-1');
        });
    });

    it('/clients/:id (GET) - retrieves a client', () => {
      return req(app.getHttpServer())
        .get('/clients/client-1')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('client-1');
        });
    });
  });

  describe('Catalog Engine', () => {
    it('/catalog (POST) - creates a catalog item', () => {
      return req(app.getHttpServer())
        .post('/catalog')
        .send({ name: 'Test Item', sku: 'SKU-001', basePrice: 100 })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('item-1');
        });
    });
  });

  describe('Quotes Engine', () => {
    it('/quotes (POST) - creates a quote', () => {
      return req(app.getHttpServer())
        .post('/quotes')
        .send({ clientId: 'client-1' })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('quote-1');
        });
    });
  });

  describe('Spaces Configuration Engine', () => {
    it('/space-configuration (POST) - sets a config', () => {
      return req(app.getHttpServer())
        .post('/space-configuration')
        .send({
          spaceId: 'space-1',
          configKey: 'theme',
          configValue: { color: 'blue' },
        })
        .expect(201);
    });
  });

  describe('Spaces Engine', () => {
    it('/spaces (POST) - creates a space', () => {
      return req(app.getHttpServer())
        .post('/spaces')
        .send({
          name: 'Test Space',
          spaceType: 'OFFICE',
          regulationTemplate: 'tpl-1',
          planoPdf: 'url',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('space-1');
        });
    });

    it('/spaces/:id (GET) - retrieves a space', () => {
      return req(app.getHttpServer())
        .get('/spaces/space-1')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('space-1');
        });
    });

    it('/spaces/:id (PUT) - updates a space', () => {
      return req(app.getHttpServer())
        .put('/spaces/space-1')
        .send({ name: 'Updated Space' })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('space-1');
        });
    });
  });

  describe('Space Occupancy Engine', () => {
    it('/occupancy (POST) - creates an occupancy', () => {
      return req(app.getHttpServer())
        .post('/occupancy')
        .send({
          spaceId: 'space-1',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('occ-1');
        });
    });
  });
});
