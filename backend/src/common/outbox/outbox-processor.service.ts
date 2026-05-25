import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { DomainEventPublisher } from '../events/domain-event-publisher';

@Injectable()
export class OutboxProcessorService {
  private readonly logger = new Logger(OutboxProcessorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processOutbox() {
    try {
      await this.prisma.$transaction(async (tx) => {
        const events = await tx.$queryRaw<
          Array<{
            id: string;
            tenant_id: string;
            payload: Record<string, unknown>;
            event_type: string;
          }>
        >`
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
        this.logger.log(
          `[OUTBOX] Procesando Event ID: ${event.id} (Tipo: ${event.event_type})`,
        );

        await tx.$executeRaw`
          UPDATE "OutboxEvent" 
          SET status = 'PROCESSING', updated_at = NOW()
          WHERE id = ${event.id}::uuid;
        `;

        await this.eventPublisher.publish({
          eventName: event.event_type,
          tenantId: event.tenant_id,
          payload: event.payload,
          timestamp: new Date(),
        });

        await tx.$executeRaw`
          UPDATE "OutboxEvent" 
          SET status = 'COMPLETED', updated_at = NOW() 
          WHERE id = ${event.id}::uuid;
        `;

        this.logger.log(
          `[OUTBOX] Event ID: ${event.id} despachado y completado con éxito.`,
        );
      });
    } catch (error) {
      this.logger.error(
        '[OUTBOX] Error durante el procesamiento del evento',
        error,
      );
      throw error;
    }
  }
}
