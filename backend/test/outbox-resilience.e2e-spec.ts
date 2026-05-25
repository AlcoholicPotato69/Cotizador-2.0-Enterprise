import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { OutboxProcessorService } from '../src/common/outbox/outbox-processor.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID as uuidv4 } from 'crypto';

describe('Outbox Resilience & Concurrency (e2e)', () => {
  let app: INestApplication;
  let prismaMock: any;
  let outboxProcessor: OutboxProcessorService;
  let eventEmitter: EventEmitter2;

  // Fake database state
  let outboxEvents: any[] = [];
  const lockedRows = new Set<string>();

  beforeAll(async () => {
    prismaMock = {
      $executeRaw: jest.fn(),
      $queryRaw: jest.fn(),
      $transaction: jest.fn(),
      $disconnect: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        OutboxProcessorService,
        {
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    outboxProcessor = moduleFixture.get<OutboxProcessorService>(
      OutboxProcessorService,
    );
    eventEmitter = moduleFixture.get<EventEmitter2>(EventEmitter2);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    outboxEvents = [];
    lockedRows.clear();
    jest.clearAllMocks();

    // Mock transaction behavior
    prismaMock.$transaction.mockImplementation(async (cb: any) => {
      const tx = {
        $queryRaw: jest.fn().mockImplementation(async (query: any) => {
          // Simulate FOR UPDATE SKIP LOCKED
          const pending = outboxEvents.find(
            (e) => e.status === 'PENDING' && !lockedRows.has(e.id),
          );
          if (pending) {
            lockedRows.add(pending.id);
            return [pending];
          }
          return [];
        }),
        $executeRaw: jest
          .fn()
          .mockImplementation(async (query: any, ...args: any[]) => {
            const sql = query[0] || '';
            console.log('EXECUTE RAW:', sql, args);
            if (sql.includes('PROCESSING')) {
              const eventId = args[0];
              const event = outboxEvents.find((e) => e.id === eventId);
              if (event) event.status = 'PROCESSING';
            } else if (sql.includes('COMPLETED')) {
              const eventId = args[0];
              const event = outboxEvents.find((e) => e.id === eventId);
              if (event) event.status = 'COMPLETED';
            }
          }),
      };

      try {
        await cb(tx);
        console.log('Transaction completed successfully');
      } catch (err) {
        console.log('Transaction rollback triggered');
        // Rollback behavior: any locked row that was in PROCESSING goes back to PENDING (simulated by not committing the transaction in a real DB)
        // Here we just revert PROCESSING back to PENDING to simulate the rollback.
        outboxEvents.forEach((e) => {
          if (e.status === 'PROCESSING') {
            console.log('Reverting to PENDING for', e.id);
            e.status = 'PENDING';
          }
        });
        throw err;
      } finally {
        // Unlock rows at end of transaction
        lockedRows.clear();
      }
    });
  });

  it('should prevent concurrent processing of the same event using SKIP LOCKED', async () => {
    const eventId = uuidv4();
    outboxEvents.push({
      id: eventId,
      status: 'PENDING',
      event_type: 'TestEvent',
      payload: {},
    });

    let processCount = 0;
    (eventEmitter.emitAsync as jest.Mock).mockImplementation(async () => {
      processCount++;
      return new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Run processOutbox concurrently 3 times
    await Promise.all([
      outboxProcessor.processOutbox(),
      outboxProcessor.processOutbox(),
      outboxProcessor.processOutbox(),
    ]);

    // Only ONE should acquire the lock and process
    expect(processCount).toBe(1);

    // Verify it was marked as COMPLETED
    expect(outboxEvents[0].status).toBe('COMPLETED');
  });

  it('should rollback to PENDING if a transactional failure occurs', async () => {
    const eventId = uuidv4();
    outboxEvents.push({
      id: eventId,
      status: 'PENDING',
      event_type: 'TestEvent',
      payload: {},
    });

    // Force failure during processing
    (eventEmitter.emitAsync as jest.Mock).mockRejectedValue(
      new Error('Simulated Processing Failure'),
    );

    // The processor will throw because it re-throws caught errors
    await expect(outboxProcessor.processOutbox()).rejects.toThrow(
      'Simulated Processing Failure',
    );

    // The status should STILL be PENDING because the rollback simulation reverted it
    expect(outboxEvents[0].status).toBe('PENDING');
  });
});
