import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { PostgresJobQueueService } from './postgres-job.service';

describe('PostgresJobQueueService', () => {
  let service: PostgresJobQueueService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostgresJobQueueService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            jobQueue: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostgresJobQueueService>(PostgresJobQueueService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should do nothing if no jobs are pending', async () => {
    const txFake = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      $executeRaw: jest.fn(),
    };
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {
      return cb(txFake as never);
    });

    await service.processNextJob();

    expect(txFake.$queryRaw).toHaveBeenCalled();
    expect(txFake.$executeRaw).not.toHaveBeenCalled();
    expect(eventEmitter.emitAsync).not.toHaveBeenCalled();
  });

  it('should process a pending job successfully', async () => {
    const testJob = {
      id: 'test-job-id',
      job_type: 'PDF_GENERATION',
      payload: { data: 'test-job' },
      tenant_id: 'tenant-id',
    };

    const txFake = {
      $queryRaw: jest.fn().mockResolvedValue([testJob]),
      $executeRaw: jest.fn(),
    };
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {
      return cb(txFake as never);
    });

    await service.processNextJob();

    expect(txFake.$queryRaw).toHaveBeenCalled();

    expect(txFake.$executeRaw).toHaveBeenCalledTimes(4);

    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      'job.execute.PDF_GENERATION',
      testJob,
    );
  });

  it('should throw error when job execution fails', async () => {
    const testJob = {
      id: 'test-job-id',
      job_type: 'FAILED_JOB',
      payload: { data: 'test-job' },
      tenant_id: 'tenant-id',
    };

    const txFake = {
      $queryRaw: jest.fn().mockResolvedValue([testJob]),
      $executeRaw: jest.fn(),
    };
    jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {
      return cb(txFake as never);
    });

    jest.spyOn(eventEmitter, 'emitAsync').mockImplementation(async () => {
      throw new Error('Job Execution Failed');
    });

    await expect(service.processNextJob()).rejects.toThrow(
      'Job Execution Failed',
    );

    expect(txFake.$queryRaw).toHaveBeenCalled();

    expect(txFake.$executeRaw).toHaveBeenCalledTimes(2);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      'job.execute.FAILED_JOB',
      testJob,
    );
  });

  it('should enqueue a new job', async () => {
    jest
      .spyOn(prisma.jobQueue, 'create')
      .mockResolvedValue({ id: 'new-job-id' } as never);

    const result = await service.enqueueJob(
      'tenant1',
      'default',
      'PDF_GENERATION' as 'PDF',
      { x: 1 },
    );
    expect(result).toEqual({ id: 'new-job-id' });
    expect(prisma.jobQueue.create).toHaveBeenCalledWith({
      data: {
        tenantId: 'tenant1',
        queueName: 'default',
        jobType: 'PDF_GENERATION',
        payload: { x: 1 },
        status: 'QUEUED',
        priority: 0,
      },
    });
  });
});
