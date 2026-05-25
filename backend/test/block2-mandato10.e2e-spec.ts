import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/auth/guards/permissions.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AgreementStatusEnum, ContractStatus } from '@prisma/client';
import { AgreementsRepository } from '../src/agreements/agreements.repository';

describe('Mandato 10.5 - Block 2 Engines (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;
  let agreementsRepository: AgreementsRepository;

  beforeAll(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'test-secret';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { tenantId: 'tenant-1', id: 'user-1', role: 'admin' };
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
            $queryRaw: jest.fn().mockResolvedValue([]),
            contract: {
              create: jest.fn().mockResolvedValue({
                id: 'contract-1',
                status: ContractStatus.DRAFT,
              }),
              findFirst: jest.fn().mockResolvedValue({
                id: 'contract-1',
                status: ContractStatus.DRAFT,
              }),
              update: jest.fn().mockResolvedValue({
                id: 'contract-1',
                status: ContractStatus.SIGNED,
              }),
            },
            signature: {
              create: jest.fn().mockResolvedValue({ id: 'sig-1' }),
            },
          };
          return await cb(tx);
        }),
        $queryRaw: jest.fn().mockResolvedValue([]),
        agreement: {
          create: jest.fn().mockResolvedValue({
            id: 'agreement-1',
            status: AgreementStatusEnum.DRAFT,
          }),
          findUnique: jest.fn().mockResolvedValue({
            id: 'agreement-1',
            status: AgreementStatusEnum.DRAFT,
          }),
          update: jest
            .fn()
            .mockImplementation((args) =>
              Promise.resolve({ id: 'agreement-1', ...args.data }),
            ),
        },
        signature: {
          findUnique: jest
            .fn()
            .mockResolvedValue({ id: 'sig-1', tenantId: 'tenant-1' }),
        },
        review: {
          create: jest.fn().mockResolvedValue({ id: 'rev-1' }),
        },
        documentReview: {
          create: jest
            .fn()
            .mockResolvedValue({ id: 'rev-1', status: 'PENDING' }),
          findUnique: jest
            .fn()
            .mockResolvedValue({ id: 'rev-1', status: 'PENDING' }),
          update: jest
            .fn()
            .mockResolvedValue({ id: 'rev-1', status: 'APPROVED' }),
        },
        documentReviewStep: {
          create: jest.fn().mockResolvedValue({ id: 'rev-step-1' }),
        },
        documentReviewDecision: {
          create: jest.fn().mockResolvedValue({ id: 'rev-dec-1' }),
        },
        auditLog: {
          findFirst: jest.fn().mockResolvedValue(null),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    eventEmitter = app.get(EventEmitter2);
    agreementsRepository = app.get(AgreementsRepository);

    // Mock the agreements repository properly since it relies on prisma.agreement natively
    jest.spyOn(agreementsRepository, 'create').mockResolvedValue({
      id: 'agreement-1',
      status: AgreementStatusEnum.DRAFT,
      clientId: 'client-1',
      tenantId: 'tenant-1',
    } as any);

    jest
      .spyOn(agreementsRepository, 'update')
      .mockImplementation(async (tenantId, id, data) => {
        return { id, tenantId, ...data } as any;
      });

    jest.spyOn(eventEmitter, 'emit');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Agreements FSM Flow (Draft -> Signed)', () => {
    it('1. Create Agreement (DRAFT)', async () => {
      const response = await request(app.getHttpServer())
        .post('/agreements')
        .send({
          clientId: 'client-1',
          type: 'NDA',
          description: 'Test Agreement',
          value: 1000,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id', 'agreement-1');
      expect(response.body).toHaveProperty('status', AgreementStatusEnum.DRAFT);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.created',
        expect.any(Object),
      );
    });

    it('2. Submit For Review', async () => {
      const response = await request(app.getHttpServer())
        .put('/agreements/agreement-1/submit-review')
        .expect(200);

      expect(response.body).toHaveProperty(
        'status',
        AgreementStatusEnum.UNDER_REVIEW,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.submitted_for_review',
        expect.any(Object),
      );
    });

    it('3. Approve Agreement', async () => {
      const response = await request(app.getHttpServer())
        .put('/agreements/agreement-1/approve')
        .expect(200);

      expect(response.body).toHaveProperty(
        'status',
        AgreementStatusEnum.APPROVED,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.approved',
        expect.any(Object),
      );
    });

    it('4. Generate Letter', async () => {
      const response = await request(app.getHttpServer())
        .put('/agreements/agreement-1/generate-letter')
        .send({ versionId: 'v1' })
        .expect(200);

      expect(response.body).toHaveProperty(
        'status',
        AgreementStatusEnum.LETTER_GENERATED,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.letter_generated',
        expect.any(Object),
      );
    });

    it('5. Pending Signature', async () => {
      const response = await request(app.getHttpServer())
        .put('/agreements/agreement-1/pending-signature')
        .expect(200);

      expect(response.body).toHaveProperty(
        'status',
        AgreementStatusEnum.PENDING_SIGNATURE,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.pending_signature',
        expect.any(Object),
      );
    });

    it('6. Mark As Signed', async () => {
      const response = await request(app.getHttpServer())
        .put('/agreements/agreement-1/sign')
        .send({ signatureId: 'sig-1' })
        .expect(200);

      expect(response.body).toHaveProperty(
        'status',
        AgreementStatusEnum.SIGNED,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'agreement.signed',
        expect.any(Object),
      );
    });
  });

  describe('PDF Engine', () => {
    it('Should generate PDF and emit event', async () => {
      const response = await request(app.getHttpServer())
        .post('/documents/generate-pdf')
        .send({
          documentId: 'doc-1',
          templateId: 'tpl-1',
          data: { name: 'John Doe' },
        })
        .expect(201);

      expect(response.body).toHaveProperty('status', 'GENERATED');
      expect(response.body).toHaveProperty('url');
      expect(response.body.url).toContain('doc-1.pdf');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'document.pdf_generated',
        expect.any(Object),
      );
    });
  });
});
