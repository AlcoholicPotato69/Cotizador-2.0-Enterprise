import { Test, TestingModule } from '@nestjs/testing';
import { NumberingService } from './numbering.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NumberingService', () => {
  let service: NumberingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NumberingService,
        {
          provide: PrismaService,
          useValue: {
            numberingSequence: {
              upsert: jest.fn().mockResolvedValue({
                currentValue: 1,
                prefix: 'Q',
                suffix: '24',
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NumberingService>(NumberingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a formatted folio', async () => {
    const dto = {
      tenantId: 'tenant-1',
      entityType: 'QUOTE',
      prefix: 'Q',
      suffix: '24',
      step: 1,
    };

    const folio = await service.generateFolio(dto);
    expect(folio).toBe('Q-000001-24');
  });
});
