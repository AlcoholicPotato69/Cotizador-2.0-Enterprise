import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/auth/guards/permissions.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';

describe('Agenda (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tenantId: string;
  let spaceId: string;

  beforeAll(async () => {
    process.env.DOCUMENT_SIGNING_SECRET = 'test-secret';

    // We need to pass the tenantId in the req.user dynamically since we create it below
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'user-1', tenantId, role: 'admin', permissions: [] };
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

    // Setup DB: create tenant and space
    const tenant = await prisma.tenant.create({
      data: { name: 'Agenda Test Tenant' },
    });
    tenantId = tenant.id;

    const space = await prisma.space.create({
      data: {
        name: 'Test Space',
        tenantId,
        capacity: 10,
        areaSqm: 100.0,
        basePricePerHour: 50.0,
        configB2b: {},
        preciosPorDia: {},
        diasBloqueados: [],
        impuestosIds: [],
        description: 'Test space description',
        tags: [],
        images: [],
        spaceType: 'OFFICE',
        regulationTemplate: 'tpl-1',
        planoPdf: 'url',
      },
    });
    spaceId = space.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.spaceOccupancy.deleteMany({ where: { spaceId } });
    await prisma.space.deleteMany({ where: { id: spaceId } });
    await prisma.tenant.deleteMany({ where: { id: tenantId } });

    await app.close();
  });

  it('ZERO OVERBOOKING SIMULATION: 50 concurrent requests to reserve same slot', async () => {
    const startTime = new Date(Date.now() + 86400000).toISOString(); // tomorrow
    const endTime = new Date(Date.now() + 86400000 + 3600000).toISOString(); // +1 hr

    const requests = Array.from({ length: 50 }).map(() =>
      request(app.getHttpServer()).post('/agenda/reserve').send({
        spaceId,
        startTime,
        endTime,
      }),
    );

    const responses = await Promise.all(requests);

    const successful = responses.filter((r) => r.status === 201);
    const failed = responses.filter((r) => r.status !== 201);

    if (successful.length === 0 && failed.length > 0) {
      console.log('Sample failure:', failed[0].status, failed[0].body);
    }

    expect(successful.length).toBe(1);
    expect(failed.length).toBe(49);

    // Ensure it's correctly saved in DB
    const occupancies = await prisma.spaceOccupancy.findMany({
      where: { spaceId, startTime: new Date(startTime) },
    });
    expect(occupancies.length).toBe(1);
  });
});
