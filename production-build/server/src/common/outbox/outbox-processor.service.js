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
var OutboxProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxProcessorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const domain_event_publisher_1 = require("../events/domain-event-publisher");
let OutboxProcessorService = OutboxProcessorService_1 = class OutboxProcessorService {
    prisma;
    eventPublisher;
    logger = new common_1.Logger(OutboxProcessorService_1.name);
    constructor(prisma, eventPublisher) {
        this.prisma = prisma;
        this.eventPublisher = eventPublisher;
    }
    async processOutbox() {
        try {
            await this.prisma.$transaction(async (tx) => {
                const events = await tx.$queryRaw `
          SELECT id, tenant_id, payload, event_type
          FROM "OutboxEvent"
          WHERE status = 'PENDING'
          ORDER BY created_at ASC
          LIMIT 1
          FOR UPDATE SKIP LOCKED;
        `;
                if (events.length === 0) {
                    return;
                }
                const event = events[0];
                this.logger.log(`[OUTBOX] Procesando Event ID: ${event.id} (Tipo: ${event.event_type})`);
                await tx.$executeRaw `
          UPDATE "OutboxEvent" 
          SET status = 'PROCESSING', updated_at = NOW()
          WHERE id = ${event.id}::uuid;
        `;
                await this.eventPublisher.publish({
                    eventName: event.event_type,
                    tenantId: event.tenant_id,
                    payload: event.payload,
                    timestamp: new Date()
                });
                await tx.$executeRaw `
          UPDATE "OutboxEvent" 
          SET status = 'COMPLETED', updated_at = NOW() 
          WHERE id = ${event.id}::uuid;
        `;
                this.logger.log(`[OUTBOX] Event ID: ${event.id} despachado y completado con éxito.`);
            });
        }
        catch (error) {
            this.logger.error('[OUTBOX] Error durante el procesamiento del evento', error);
            throw error;
        }
    }
};
exports.OutboxProcessorService = OutboxProcessorService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_SECOND),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OutboxProcessorService.prototype, "processOutbox", null);
exports.OutboxProcessorService = OutboxProcessorService = OutboxProcessorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        domain_event_publisher_1.DomainEventPublisher])
], OutboxProcessorService);
//# sourceMappingURL=outbox-processor.service.js.map