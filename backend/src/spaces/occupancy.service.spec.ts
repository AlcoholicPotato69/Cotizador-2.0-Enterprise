import { Test, TestingModule } from '@nestjs/testing';
import { OccupancyService } from './occupancy.service';
import { OccupancyRepository } from './occupancy.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { PrismaService } from '../prisma/prisma.service';
import { tenantContext } from '../prisma/tenant-context';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('OccupancyService', () => {
  let service: OccupancyService;
  let repo: OccupancyRepository;
  let eventPublisher: DomainEventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OccupancyService,
        {
          provide: OccupancyRepository,
          useValue: {
            findOverlapping: jest.fn().mockResolvedValue(null),
            create: jest
              .fn()
              .mockResolvedValue({ id: 'occ-1', spaceId: 'space-1' }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation(async (cb) => {
              return await cb({
                spaceOccupancy: {
                  findFirst: jest.fn().mockResolvedValue(null),
                  create: jest
                    .fn()
                    .mockResolvedValue({ id: 'occ-1', spaceId: 'space-1' }),
                },
              });
            }),
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

    service = module.get<OccupancyService>(OccupancyService);
    repo = module.get<OccupancyRepository>(OccupancyRepository);
    eventPublisher = module.get<DomainEventPublisher>(DomainEventPublisher);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if tenant context is missing', async () => {
    await expect(
      service.createOccupancy({
        spaceId: 'space-1',
        startTime: new Date(),
        endTime: new Date(),
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  describe('with tenant context', () => {
    it('should create occupancy and emit event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          const result = await service.createOccupancy({
            spaceId: 'space-1',
            startTime: new Date(),
            endTime: new Date(),
          } as any);
          expect(result.id).toBe('occ-1');
          expect(repo.create).toHaveBeenCalled();
          expect(eventPublisher.publish).toHaveBeenCalledWith(
            expect.objectContaining({
              eventName: 'occupancy.created',
              tenantId: 'tenant-1',
              payload: { occupancyId: 'occ-1', spaceId: 'space-1' },
            }),
          );
        },
      );
    });

    it('should throw ConflictException if overlapping', async () => {
      jest
        .spyOn(repo, 'findOverlapping')
        .mockResolvedValueOnce({ id: 'occ-2' } as any);
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          await expect(
            service.createOccupancy({
              spaceId: 'space-1',
              startTime: new Date(),
              endTime: new Date(),
            } as any),
          ).rejects.toThrow(ConflictException);
        },
      );
    });
  });
});
