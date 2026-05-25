"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PostgresJobQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresJobQueueService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let PostgresJobQueueService = PostgresJobQueueService_1 = class PostgresJobQueueService {
    prisma;
    eventEmitter;
    logger = new common_1.Logger(PostgresJobQueueService_1.name);
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async processNextJob() {
        try {
            let jobToProcess = null;
            await this.prisma.$transaction(async (tx) => {
                const jobs = await tx.$queryRaw `
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
                this.logger.log(`[JOB_QUEUE] Procesando Job ID: ${job.id} (Tipo: ${job.job_type})`);
                await tx.$executeRaw `
          UPDATE "JobQueue" 
          SET status = 'RUNNING', updated_at = NOW()
          WHERE id = ${job.id}::uuid;
        `;
                await tx.$executeRaw `
          INSERT INTO "JobExecution" (id, tenant_id, job_id, status, started_at, created_at, updated_at)
          VALUES (gen_random_uuid(), ${job.tenant_id}::uuid, ${job.id}::uuid, 'RUNNING', NOW(), NOW(), NOW());
        `;
                jobToProcess = job;
            });
            if (jobToProcess) {
                await this.handleJobPayload(jobToProcess);
                await this.prisma.$transaction(async (tx) => {
                    await tx.$executeRaw `
            UPDATE "JobQueue" 
            SET status = 'COMPLETED', updated_at = NOW() 
            WHERE id = ${jobToProcess.id}::uuid;
          `;
                    await tx.$executeRaw `
            UPDATE "JobExecution" 
            SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW()
            WHERE job_id = ${jobToProcess.id}::uuid AND status = 'RUNNING';
          `;
                });
                this.logger.log(`[JOB_QUEUE] Job ID: ${jobToProcess.id} completado con éxito.`);
            }
        }
        catch (error) {
            this.logger.error('[JOB_QUEUE] Error durante el procesamiento del trabajo', error);
            throw error;
        }
    }
    async handleJobPayload(job) {
        await this.eventEmitter.emitAsync(`job.execute.${job.job_type}`, job);
    }
    async enqueueJob(tenantId, queueName, jobType, payload, priority = 0) {
        return this.prisma.jobQueue.create({
            data: {
                tenantId,
                queueName,
                jobType,
                payload: payload,
                status: 'QUEUED',
                priority
            }
        });
    }
};
exports.PostgresJobQueueService = PostgresJobQueueService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostgresJobQueueService.prototype, "processNextJob", null);
exports.PostgresJobQueueService = PostgresJobQueueService = PostgresJobQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], PostgresJobQueueService);
//# sourceMappingURL=postgres-job.service.js.map