import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../prisma/tenant-context', () => ({
  tenantContext: {
    getStore: jest.fn().mockReturnValue({ tenantId: 'tenant-1' }),
  },
}));

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {
            invoice: {
              count: jest.fn().mockResolvedValue(10),
              aggregate: jest.fn().mockImplementation(({ where }) => {
                if (where.status === 'PAID') {
                  return { _sum: { totalAmount: { toNumber: () => 1000 } } };
                }
                return { _sum: { balanceDue: { toNumber: () => 500 } } };
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return kpis', async () => {
    const kpis = await service.getKpis();
    expect(kpis).toEqual({
      totalInvoices: 10,
      totalRevenue: 1000,
      pendingBalance: 500,
    });
  });
});
