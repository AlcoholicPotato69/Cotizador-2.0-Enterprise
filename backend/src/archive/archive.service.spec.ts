import { Test, TestingModule } from '@nestjs/testing';
import { ArchiveEngineService } from './archive.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../prisma/tenant-context', () => ({
  tenantContext: {
    getStore: jest.fn().mockReturnValue({ tenantId: 'tenant-1' }),
  },
}));

describe('ArchiveEngineService', () => {
  let service: ArchiveEngineService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchiveEngineService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              findFirst: jest.fn().mockResolvedValue({ id: 'c1' }),
              update: jest
                .fn()
                .mockResolvedValue({ id: 'c1', status: 'ARCHIVED' }),
            },
            document: {
              findMany: jest.fn().mockResolvedValue([{ id: 'd1' }]),
              updateMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ArchiveEngineService>(ArchiveEngineService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should archive entity Client', async () => {
    const result = await service.archiveEntity('Client', 'c1', 'admin');
    expect(prisma.client.update).toHaveBeenCalled();
    expect(result).toEqual({ id: 'c1', status: 'ARCHIVED' });
  });

  it('should apply retention policies', async () => {
    await service.applyRetentionPolicies();
    expect(prisma.document.findMany).toHaveBeenCalled();
    expect(prisma.document.updateMany).toHaveBeenCalled();
  });
});
