import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { JobType } from './job-types';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PostgresJobQueueService {
  private readonly logger = new Logger(PostgresJobQueueService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async processNextJob() {
    try {
      let jobToProcess: {
        id: string;
        job_type: string;
        payload: Record<string, unknown>;
        tenant_id: string;
      } | null = null;

      await this.prisma.$transaction(async (tx) => {
        const jobs = await tx.$queryRaw<
          Array<{
            id: string;
            payload: Record<string, unknown>;
            job_type: string;
            tenant_id: string;
          }>
        >`
          SELECT id, payload, job_type, tenant_id
          FROM "JobQueue"
          WHERE status = 'QUEUED'
          ORDER BY created_at ASC
          LIMIT 1
          FOR UPDATE SKIP LOCKED;
        `;

        if (jobs.length === 0) {
          return;
        }

        const job = jobs[0];
        this.logger.log(
          `[JOB_QUEUE] Procesando Job ID: ${job.id} (Tipo: ${job.job_type})`,
        );

        await tx.$executeRaw`
          UPDATE "JobQueue" 
          SET status = 'RUNNING', updated_at = NOW()
          WHERE id = ${job.id}::uuid;
        `;

        await tx.$executeRaw`
          INSERT INTO "JobExecution" (id, tenant_id, job_id, status, started_at, created_at, updated_at)
          VALUES (gen_random_uuid(), ${job.tenant_id}::uuid, ${job.id}::uuid, 'RUNNING', NOW(), NOW(), NOW());
        `;

        jobToProcess = job;
      });

      if (jobToProcess) {
        await this.handleJobPayload(jobToProcess);

        await this.prisma.$transaction(async (tx) => {
          await tx.$executeRaw`
            UPDATE "JobQueue" 
            SET status = 'COMPLETED', updated_at = NOW() 
            WHERE id = ${(jobToProcess as { id: string }).id}::uuid;
          `;

          await tx.$executeRaw`
            UPDATE "JobExecution" 
            SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW()
            WHERE job_id = ${(jobToProcess as { id: string }).id}::uuid AND status = 'RUNNING';
          `;
        });

        this.logger.log(
          `[JOB_QUEUE] Job ID: ${(jobToProcess as { id: string }).id} completado con éxito.`,
        );
      }
    } catch (error) {
      this.logger.error(
        '[JOB_QUEUE] Error durante el procesamiento del trabajo',
        error,
      );
      throw error;
    }
  }

  private async handleJobPayload(job: {
    job_type: string;
    [key: string]: unknown;
  }) {
    await this.eventEmitter.emitAsync(`job.execute.${job.job_type}`, job);
  }

  async enqueueJob(
    tenantId: string,
    queueName: string,
    jobType: JobType,
    payload: Record<string, unknown>,
    priority: number = 0,
  ) {
    return this.prisma.jobQueue.create({
      data: {
        tenantId,
        queueName,
        jobType,
        payload: payload as any,
        status: 'QUEUED',
        priority,
      },
    });
  }
}
