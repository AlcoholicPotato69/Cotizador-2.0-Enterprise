import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
            healthCheckMetric: {
              create: jest
                .fn()
                .mockImplementation(({ data }) =>
                  Promise.resolve({ id: 'metric-1', ...data }),
                ),
              findMany: jest
                .fn()
                .mockResolvedValue([{ id: 'metric-1', status: 'ok' }]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check health', async () => {
    const result = await service.checkHealth();
    expect(result.status).toBe('ok');
    expect(result.db).toBe('connected');
  });

  it('should get metrics by tenant', async () => {
    const result = await service.getMetricsByTenant('tenant-1');
    expect(result.length).toBe(1);
    expect(result[0].status).toBe('ok');
  });
});
