import { Test, TestingModule } from '@nestjs/testing';
import { GlobalSearchEngineService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GlobalSearchEngineService', () => {
  let service: GlobalSearchEngineService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalSearchEngineService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest
              .fn()
              .mockResolvedValue([
                { id: '1', entity_type: 'Client', payload: {}, relevance: 0.9 },
              ]),
          },
        },
      ],
    }).compile();

    service = module.get<GlobalSearchEngineService>(GlobalSearchEngineService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute global search with raw query', async () => {
    const results = await service.globalSearch('test', 'tenant-1');
    expect(prisma.$queryRaw).toHaveBeenCalled();
    expect(results).toEqual([
      { id: '1', entity_type: 'Client', payload: {}, relevance: 0.9 },
    ]);
  });
});
