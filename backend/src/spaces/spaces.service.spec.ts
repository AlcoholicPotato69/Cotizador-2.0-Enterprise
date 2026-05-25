import { Test, TestingModule } from '@nestjs/testing';
import { SpacesService } from './spaces.service';
import { SpacesRepository } from './spaces.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';
import { NotFoundException } from '@nestjs/common';

describe('SpacesService', () => {
  let service: SpacesService;
  let repo: SpacesRepository;
  let eventPublisher: DomainEventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        {
          provide: SpacesRepository,
          useValue: {
            create: jest
              .fn()
              .mockResolvedValue({ id: 'space-1', name: 'Test Space' }),
            findById: jest
              .fn()
              .mockResolvedValue({ id: 'space-1', name: 'Test Space' }),
            update: jest
              .fn()
              .mockResolvedValue({ id: 'space-1', name: 'Updated Space' }),
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

    service = module.get<SpacesService>(SpacesService);
    repo = module.get<SpacesRepository>(SpacesRepository);
    eventPublisher = module.get<DomainEventPublisher>(DomainEventPublisher);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if tenant context is missing', async () => {
    await expect(
      service.create({
        name: 'Test',
        spaceType: 'publicidad física',
        planoPdf: 'url',
        regulationTemplate: 'url',
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  describe('with tenant context', () => {
    it('should create a space and emit event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          const result = await service.create({
            name: 'Test',
            spaceType: 'publicidad física',
            planoPdf: 'url',
            regulationTemplate: 'url',
          } as any);
          expect(result.id).toBe('space-1');
          expect(repo.create).toHaveBeenCalled();
          expect(eventPublisher.publish).toHaveBeenCalledWith(
            expect.objectContaining({
              eventName: 'space.created',
              tenantId: 'tenant-1',
              payload: { spaceId: 'space-1' },
            }),
          );
        },
      );
    });

    it('should find space by id', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          const result = await service.findById('space-1');
          expect(result.id).toBe('space-1');
          expect(repo.findById).toHaveBeenCalledWith('tenant-1', 'space-1');
        },
      );
    });

    it('should update a space and emit event', async () => {
      await tenantContext.run(
        { tenantId: 'tenant-1', userId: 'user-1', role: 'admin' },
        async () => {
          const result = await service.update('space-1', {
            name: 'Updated Space',
          });
          expect(result.id).toBe('space-1');
          expect(repo.update).toHaveBeenCalledWith('tenant-1', 'space-1', {
            name: 'Updated Space',
          });
          expect(eventPublisher.publish).toHaveBeenCalledWith(
            expect.objectContaining({
              eventName: 'space.updated',
              tenantId: 'tenant-1',
              payload: { spaceId: 'space-1' },
            }),
          );
        },
      );
    });
  });
});
