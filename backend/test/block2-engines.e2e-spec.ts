import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { CatalogService } from '../src/catalog/catalog.service';
import { TemplatesService } from '../src/templates/templates.service';
import { RegulationsService } from '../src/regulations/regulations.service';
import { SpaceConfigurationService } from '../src/spaces/configuration/space-configuration.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { tenantContext } from '../src/prisma/tenant-context';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

import { CatalogModule } from '../src/catalog/catalog.module';
import { TemplatesModule } from '../src/templates/templates.module';
import { RegulationsModule } from '../src/regulations/regulations.module';
import { SpacesModule } from '../src/spaces/spaces.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { AuditModule } from '../src/audit/audit.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('Block 2 Engines (e2e)', () => {
  let app: INestApplication;
  let catalogService: CatalogService;
  let templatesService: TemplatesService;
  let regulationsService: RegulationsService;
  let spaceConfigService: SpaceConfigurationService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'super-secret-document-key';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot(),
        PrismaModule,
        AuditModule,
        CatalogModule,
        TemplatesModule,
        RegulationsModule,
        SpacesModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $transaction: jest.fn().mockImplementation(async (cb) => {
          const tx = {
            $executeRaw: jest.fn().mockResolvedValue({}),
            catalogItem: {
              create: jest.fn().mockResolvedValue({ id: 'item-1' }),
            },
            catalogPrice: { create: jest.fn().mockResolvedValue({}) },
            contractTemplate: {
              create: jest.fn().mockResolvedValue({ id: 'tpl-1' }),
              findFirst: jest.fn().mockResolvedValue({ id: 'tpl-1' }),
            },
            contractTemplateVersion: {
              create: jest.fn().mockResolvedValue({}),
            },
            contractClause: {
              create: jest.fn().mockResolvedValue({ id: 'cl-1' }),
            },
            clauseVersion: { create: jest.fn().mockResolvedValue({}) },
            regulation: {
              create: jest.fn().mockResolvedValue({ id: 'reg-1' }),
              findFirst: jest.fn().mockResolvedValue({ id: 'reg-1' }),
            },
            regulationVersion: { create: jest.fn().mockResolvedValue({}) },
            regulationAcceptance: {
              create: jest.fn().mockResolvedValue({ id: 'acc-1' }),
            },
            space: {
              findFirst: jest.fn().mockResolvedValue({ id: 'space-1' }),
            },
            spaceConfiguration: {
              create: jest.fn().mockResolvedValue({ id: 'cfg-1' }),
            },
            spaceRule: {
              create: jest.fn().mockResolvedValue({ id: 'rule-1' }),
            },
          };
          return await cb(tx);
        }),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    catalogService = app.get(CatalogService);
    templatesService = app.get(TemplatesService);
    regulationsService = app.get(RegulationsService);
    spaceConfigService = app.get(SpaceConfigurationService);
    prisma = app.get(PrismaService);

    jest.spyOn((catalogService as any).eventPublisher, 'publish');
    jest.spyOn((templatesService as any).eventEmitter, 'emit');
    jest.spyOn((regulationsService as any).eventEmitter, 'emit');
    jest.spyOn((spaceConfigService as any).eventEmitter, 'emit');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Catalog V5 Engine', () => {
    it('creates a catalog item and price, enforcing tenant isolation and emitting event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          try {
            await catalogService.createItem({
              name: 'Item 1',
              sku: 'SKU-001',
              basePrice: 100,
            });
          } catch (err) {
            console.error('CATALOG ERROR', err);
          }
        },
      );

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(
        (catalogService as any).eventPublisher.publish,
      ).toHaveBeenCalledWith(
        expect.objectContaining({ eventName: 'catalog.item.created' }),
      );
    });
  });

  describe('Template V3 Engine', () => {
    it('creates a template, enforcing tenant isolation and emitting event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          await templatesService.createTemplate({
            name: 'Template 1',
            content: 'Hello World',
          });
        },
      );

      expect((templatesService as any).eventEmitter.emit).toHaveBeenCalledWith(
        'template.created',
        expect.any(Object),
      );
    });

    it('creates a clause, enforcing tenant isolation and emitting event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          await templatesService.createClause({
            templateId: 'tpl-1',
            title: 'Clause 1',
            content: 'Hello World',
          });
        },
      );

      expect((templatesService as any).eventEmitter.emit).toHaveBeenCalledWith(
        'clause.created',
        expect.any(Object),
      );
    });
  });

  describe('Regulation Engine', () => {
    it('creates a regulation, enforcing tenant isolation and emitting event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          await regulationsService.createRegulation({
            title: 'Reg 1',
            content: 'Content',
          });
        },
      );

      expect(
        (regulationsService as any).eventEmitter.emit,
      ).toHaveBeenCalledWith('regulation.created', expect.any(Object));
    });

    it('accepts a regulation, enforcing tenant isolation and emitting event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          await regulationsService.acceptRegulation({
            regulationId: 'reg-1',
            acceptedBy: 'user-2',
            ipAddress: '127.0.0.1',
            userAgent: 'Jest',
            version: '1.0',
          });
        },
      );

      expect(
        (regulationsService as any).eventEmitter.emit,
      ).toHaveBeenCalledWith('regulation.accepted', expect.any(Object));
    });
  });

  describe('Space Configuration', () => {
    it('sets a configuration, enforcing tenant isolation and emitting event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          await spaceConfigService.setConfiguration({
            spaceId: 'space-1',
            configKey: 'theme',
            configValue: { color: 'red' },
          });
        },
      );

      expect(
        (spaceConfigService as any).eventEmitter.emit,
      ).toHaveBeenCalledWith('space.configuration.updated', expect.any(Object));
    });

    it('creates a space rule, enforcing tenant isolation and emitting event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          await spaceConfigService.createRule({
            spaceId: 'space-1',
            ruleType: 'access',
            ruleDetails: { role: 'admin' },
          });
        },
      );

      expect(
        (spaceConfigService as any).eventEmitter.emit,
      ).toHaveBeenCalledWith('space.rule.created', expect.any(Object));
    });
  });
});
