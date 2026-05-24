import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityEngineService } from './availability.service';
import { PrismaService } from '../prisma/prisma.service';
import { SpacesRepository } from './spaces.repository';
import { OccupancyRepository } from './occupancy.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';
import { ConflictException } from '@nestjs/common';
import { OccupancyStatus } from '@prisma/client';

describe('AvailabilityEngineService', () => {
  let service: AvailabilityEngineService;
  let prisma: jest.Mocked<PrismaService>;
  let spacesRepo: jest.Mocked<SpacesRepository>;
  let occupancyRepo: jest.Mocked<OccupancyRepository>;
  let eventPublisher: jest.Mocked<DomainEventPublisher>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityEngineService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              $transaction: jest.fn((callback) => {
                const tx = {
                  $executeRaw: jest.fn(),
                };
                return callback(tx);
              }),
            },
          },
        },
        {
          provide: SpacesRepository,
          useValue: {
            findByIdForUpdate: jest.fn(),
          },
        },
        {
          provide: OccupancyRepository,
          useValue: {
            findOverlapping: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: DomainEventPublisher,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AvailabilityEngineService>(AvailabilityEngineService);
    prisma = module.get(PrismaService) as any;
    spacesRepo = module.get(SpacesRepository) as any;
    occupancyRepo = module.get(OccupancyRepository) as any;
    eventPublisher = module.get(DomainEventPublisher) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserveSpace', () => {
    const request = {
      spaceId: 'space-1',
      startTime: new Date('2026-06-01T10:00:00Z'),
      endTime: new Date('2026-06-01T12:00:00Z'),
    };
    const sourceId = 'quote-1';
    const sourceType = 'Quote';

    it('should throw ConflictException if tenant context is missing', async () => {
      await expect(service.reserveSpace(request, sourceId, sourceType)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if startTime >= endTime', async () => {
      const invalidReq = { ...request, startTime: new Date('2026-06-01T12:00:00Z'), endTime: new Date('2026-06-01T10:00:00Z') };
      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        await expect(service.reserveSpace(invalidReq, sourceId, sourceType)).rejects.toThrow('Start time must be before end time');
      });
    });

    it('should throw ConflictException if space is reserved by another transaction (concurrency collision)', async () => {
      spacesRepo.findByIdForUpdate.mockResolvedValue({ id: 'space-1', diasBloqueados: [] } as any);
      occupancyRepo.findOverlapping.mockResolvedValue({ id: 'existing-occupancy' } as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        await expect(service.reserveSpace(request, sourceId, sourceType)).rejects.toThrow('Concurrency conflict: Space was reserved by another transaction.');
      });

      expect(occupancyRepo.create).not.toHaveBeenCalled();
    });

    it('should successfully reserve a space when no overlaps exist', async () => {
      spacesRepo.findByIdForUpdate.mockResolvedValue({ id: 'space-1', diasBloqueados: [] } as any);
      occupancyRepo.findOverlapping.mockResolvedValue(null);
      occupancyRepo.create.mockResolvedValue({ id: 'occ-1' } as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.reserveSpace(request, sourceId, sourceType);

        expect(result).toBe('occ-1');
        expect(spacesRepo.findByIdForUpdate).toHaveBeenCalled();
        expect(occupancyRepo.findOverlapping).toHaveBeenCalled();
        expect(occupancyRepo.create).toHaveBeenCalledWith(expect.anything(), {
          tenantId: 'tenant-1',
          spaceId: 'space-1',
          startTime: request.startTime,
          endTime: request.endTime,
          status: OccupancyStatus.HOLD,
          occupancySourceId: sourceId,
          occupancySourceType: sourceType,
        });
      });
    });
  });
});
