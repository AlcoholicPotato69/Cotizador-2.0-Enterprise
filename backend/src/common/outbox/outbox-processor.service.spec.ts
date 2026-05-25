import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { OutboxProcessorService } from './outbox-processor.service';
import { DomainEventPublisher } from './../events/domain-event-publisher';

describe('OutboxProcessorService', () => {
  let service: OutboxProcessorService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;
  let eventPublisher: DomainEventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutboxProcessorService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            $executeRaw: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn(),
          },
        },
        { provide: DomainEventPublisher, useValue: { publish: jest.fn() } },
      ],
    }).compile();

    service = module.get<OutboxProcessorService>(OutboxProcessorService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    eventPublisher = module.get<DomainEventPublisher>(DomainEventPublisher);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should do nothing if no events are pending', async () => {
    const txFake = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      $executeRaw: jest.fn(),
    };
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {
      return cb(txFake as never);
    });

    await service.processOutbox();

    expect(txFake.$queryRaw).toHaveBeenCalled();
    expect(txFake.$executeRaw).not.toHaveBeenCalled();
    expect(eventEmitter.emitAsync).not.toHaveBeenCalled();
  });

  it('should process a pending event successfully', async () => {
    const testEvent = {
      id: 'test-id',
      event_type: 'TestEvent',
      payload: { data: 'test' },
      tenant_id: 'tenant-1',
    };

    const txFake = {
      $queryRaw: jest.fn().mockResolvedValue([testEvent]),
      $executeRaw: jest.fn(),
    };
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {
      return cb(txFake as never);
    });

    await service.processOutbox();

    expect(txFake.$queryRaw).toHaveBeenCalled();

    expect(txFake.$executeRaw).toHaveBeenCalledTimes(2);
    expect(prisma.$executeRaw).not.toHaveBeenCalled();

    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'TestEvent',
        payload: { data: 'test' },
      }),
    );
  });

  it('should rollback and catch error when emitAsync fails', async () => {
    const testEvent = {
      id: 'test-id',
      event_type: 'TestEvent',
      payload: { data: 'test' },
      tenant_id: 'tenant-1',
    };

    const txFake = {
      $queryRaw: jest.fn().mockResolvedValue([testEvent]),
      $executeRaw: jest.fn(),
    };
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {
      return cb(txFake as never);
    });

    jest.spyOn(eventPublisher, 'publish').mockImplementation(async () => {
      throw new Error('Emit Failed');
    });

    await expect(service.processOutbox()).rejects.toThrow('Emit Failed');

    expect(txFake.$queryRaw).toHaveBeenCalled();

    expect(txFake.$executeRaw).toHaveBeenCalledTimes(1);

    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'TestEvent',
        payload: { data: 'test' },
      }),
    );

    expect(prisma.$executeRaw).not.toHaveBeenCalled();
  });
});
