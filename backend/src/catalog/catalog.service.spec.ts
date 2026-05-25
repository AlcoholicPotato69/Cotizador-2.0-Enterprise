import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../prisma/prisma.service';
import { CatalogRepository } from './catalog.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { tenantContext } from '../prisma/tenant-context';
import { ConflictException } from '@nestjs/common';

describe('CatalogService', () => {
  let service: CatalogService;
  let repo: CatalogRepository;
  let eventPublisher: DomainEventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: CatalogRepository,
          useValue: {
            getPrisma: jest.fn().mockReturnValue({
              $transaction: jest.fn(),
            }),
            createItem: jest.fn(),
            createPrice: jest.fn(),
          },
        },
        {
          provide: DomainEventPublisher,
          useValue: { publish: jest.fn() },
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    repo = module.get<CatalogRepository>(CatalogRepository);
    eventPublisher = module.get<DomainEventPublisher>(DomainEventPublisher);
  });

  it('should throw if tenant context is missing', async () => {
    jest.spyOn(tenantContext, 'getStore').mockReturnValue(undefined);
    await expect(
      service.createItem({ name: 'Test', sku: 'SKU1', basePrice: 100 }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create item, price and emit event within a transaction', async () => {
    jest.spyOn(tenantContext, 'getStore').mockReturnValue({
      tenantId: 'tenant-1',
      userId: 'user-1',
      role: 'admin',
    });

    const mockItem = { id: 'item-1', tenantId: 'tenant-1', sku: 'SKU1' };

    (repo.createItem as jest.Mock).mockResolvedValue(mockItem);
    (repo.getPrisma().$transaction as jest.Mock).mockImplementation(
      async (cb) => {
        const tx = {
          $executeRaw: jest.fn(),
        };
        return await cb(tx);
      },
    );

    const result = await service.createItem({
      name: 'Test Item',
      sku: 'SKU1',
      basePrice: 150,
    });

    expect(result).toEqual(mockItem);
    expect(repo.getPrisma().$transaction).toHaveBeenCalled();
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventName: 'catalog.item.created' }),
    );
  });
});
