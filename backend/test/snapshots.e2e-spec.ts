import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import * as crypto from 'crypto';
import { DomainEventPublisher } from '../src/common/events/domain-event-publisher';

describe('Snapshots Engine (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let eventPublisher: DomainEventPublisher;

  const mockUser = {
    id: 'user-snapshot',
    tenantId: 'tenant-snapshot-1',
    role: 'admin',
    email: 'admin@snapshots.com',
    permissions: ['quotes:write', 'quotes:read', 'spaces:write', 'spaces:read'],
  };

  beforeAll(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'test-secret';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    eventPublisher = app.get(DomainEventPublisher);

    // Clean up before test
    await prisma.snapshot.deleteMany({
      where: { tenantId: 'tenant-snapshot-1' },
    });
    await prisma.quote.deleteMany({ where: { tenantId: 'tenant-snapshot-1' } });
    await prisma.client.deleteMany({
      where: { tenantId: 'tenant-snapshot-1' },
    });

    await prisma.tenant.upsert({
      where: { id: 'tenant-snapshot-1' },
      update: {},
      create: { id: 'tenant-snapshot-1', name: 'Tenant Snapshot' },
    });

    await prisma.client.upsert({
      where: { id: 'client-1' },
      update: { tenantId: 'tenant-snapshot-1' },
      create: { id: 'client-1', tenantId: 'tenant-snapshot-1', status: 'LEAD' },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.snapshot.deleteMany({
        where: { tenantId: 'tenant-snapshot-1' },
      });
      await prisma.quote.deleteMany({
        where: { tenantId: 'tenant-snapshot-1' },
      });
      await prisma.client.deleteMany({
        where: { tenantId: 'tenant-snapshot-1' },
      });
    }
    if (app) await app.close();
  });

  it('should emit a snapshot, modify the quote, and verify immutability mathematically', async () => {
    // 1. Create a Quotation
    let quoteId = '';
    const initialPayload = {
      clientId: 'client-1',
      clientSnapshotId: 'client-snap-1',
      occupancySnapshotId: 'occ-snap-1',
      totalAmount: 1000,
      currencyCode: 'USD',
      desglosePrecios: {},
    };

    const res = await request(app.getHttpServer())
      .post('/quotes')
      .send(initialPayload)
      .expect(201);

    quoteId = res.body.id;
    expect(quoteId).toBeDefined();

    // The system should have emitted 'quote.created' async. We wait a bit.
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Wait, the API only emits `{ quoteId: quote.id }`.
    // The prompt says: "Comprueba matemáticamente que el registro en la tabla de Snapshots se mantuvo 100% INMUTABLE y que su hash coincide."
    // Let's verify what is in the Snapshots table.
    const snapshot = await prisma.snapshot.findFirst({
      where: { tenantId: 'tenant-snapshot-1', entityType: 'QUOTE' },
      orderBy: { createdAt: 'desc' },
    });

    // If the snapshot engine saves only `{ quoteId }`, we can check it.
    // If it saves the full quote, we can check that too.
    expect(snapshot).toBeDefined();

    // We store the original snapshot state
    const originalSnapshotId = snapshot!.id;
    const originalPayload = snapshot!.payload;
    const originalHash = snapshot!.payloadHash;
    const originalChainHash = snapshot!.chainHash;

    // 2. Modify aggressively the Quote original in the DB
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        totalAmount: 999999,
        currencyCode: 'EUR',
      },
    });

    // We fetch the quote to confirm it was modified
    const modifiedQuote = await prisma.quote.findUnique({
      where: { id: quoteId },
    });
    expect(Number(modifiedQuote!.totalAmount)).toBe(999999);
    expect(modifiedQuote!.currencyCode).toBe('EUR');

    // 3. Assert (expect): Comprueba matemáticamente que el registro en la tabla de Snapshots se mantuvo 100% INMUTABLE y que su hash coincide.
    const snapshotAfterModification = await prisma.snapshot.findUnique({
      where: { id: originalSnapshotId },
    });

    expect(snapshotAfterModification).toBeDefined();
    expect(snapshotAfterModification!.payload).toEqual(originalPayload);
    expect(snapshotAfterModification!.payloadHash).toBe(originalHash);
    expect(snapshotAfterModification!.chainHash).toBe(originalChainHash);

    // Matemáticamente comprobar el hash
    const payloadString = JSON.stringify(snapshotAfterModification!.payload);
    const calculatedHash = crypto
      .createHash('sha256')
      .update(payloadString)
      .digest('hex');
    expect(snapshotAfterModification!.payloadHash).toBe(calculatedHash);

    // Test chain hash if possible, but let's just make sure the basic hash is correct
    if (snapshotAfterModification!.previousHash === 'GENESIS') {
      const expectedChainHash = crypto
        .createHash('sha256')
        .update('GENESIS' + calculatedHash)
        .digest('hex');
      expect(snapshotAfterModification!.chainHash).toBe(expectedChainHash);
    }
  });
});
