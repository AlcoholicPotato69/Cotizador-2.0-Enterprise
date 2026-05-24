import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsRepository } from './snapshots.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('SnapshotsService', () => {
  let service: SnapshotsService;
  let repo: jest.Mocked<SnapshotsRepository>;
  let eventPublisher: jest.Mocked<DomainEventPublisher>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnapshotsService,
        {
          provide: SnapshotsRepository,
          useValue: {
            findLatestByType: jest.fn(),
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

    service = module.get<SnapshotsService>(SnapshotsService);
    repo = module.get(SnapshotsRepository) as any;
    eventPublisher = module.get(DomainEventPublisher) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSnapshot', () => {
    it('should throw BadRequestException if tenant context is missing', async () => {
      await expect(
        service.createSnapshot({ entityType: 'Quote', payload: { foo: 'bar' } })
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a snapshot with version 1 if no previous snapshot exists', async () => {
      repo.findLatestByType.mockResolvedValue(null);
      const payload = { test: 'data' };
      const expectedHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
      
      const createdSnapshot = { id: 'snap-1', entityType: 'Quote', version: 1, payloadHash: expectedHash, payload, tenantId: 'tenant-1' };
      repo.create.mockResolvedValue(createdSnapshot as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.createSnapshot({ entityType: 'Quote', payload });
        
        expect(result).toEqual(createdSnapshot);
        expect(repo.findLatestByType).toHaveBeenCalledWith('Quote', 'tenant-1');
        expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
          tenantId: 'tenant-1',
          entityType: 'Quote',
          payloadHash: expectedHash,
          version: 1,
          payload,
        }));
        
        expect(eventPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({
          eventName: 'snapshot.created',
          tenantId: 'tenant-1',
          payload: { snapshotId: 'snap-1', entityType: 'Quote', version: 1 },
        }));
      });
    });

    it('should increment version if a previous snapshot exists', async () => {
      const existingSnapshot = { id: 'snap-0', entityType: 'Quote', version: 3, tenantId: 'tenant-1' };
      repo.findLatestByType.mockResolvedValue(existingSnapshot as any);
      
      const payload = { test: 'data v4' };
      const expectedHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
      
      const createdSnapshot = { id: 'snap-1', entityType: 'Quote', version: 4, payloadHash: expectedHash, payload, tenantId: 'tenant-1' };
      repo.create.mockResolvedValue(createdSnapshot as any);

      await tenantContext.run({ tenantId: 'tenant-1' }, async () => {
        const result = await service.createSnapshot({ entityType: 'Quote', payload });
        
        expect(result.version).toBe(4);
        expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
          version: 4,
          payloadHash: expectedHash,
        }));
      });
    });
  });
});
