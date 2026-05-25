import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InboxService {
  private readonly logger = new Logger(InboxService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Procesa un evento entrante garantizando idempotencia.
   */
  async processIdempotent(
    tenantId: string,
    eventId: string,
    eventType: string,
    payload: Record<string, unknown>,
    handler: () => Promise<void>,
  ): Promise<void> {
    try {
      await this.prisma.inboxEvent.create({
        data: {
          tenantId,
          eventId,
          eventType,
          payload: payload as any,
          status: 'PENDING',
        },
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        this.logger.warn(
          `[INBOX] Evento ${eventId} (${eventType}) ignorado (Duplicado / Ya procesado).`,
        );
        return;
      }
      throw error;
    }

    try {
      await handler();

      await this.prisma.inboxEvent.updateMany({
        where: { eventId, tenantId },
        data: {
          status: 'COMPLETED' as any,
          processedAt: new Date(),
        },
      });
      this.logger.log(
        `[INBOX] Evento ${eventId} (${eventType}) procesado exitosamente.`,
      );
    } catch (handlerError) {
      this.logger.error(
        `[INBOX] Error al procesar evento ${eventId} (${eventType})`,
        handlerError,
      );
      await this.prisma.inboxEvent.updateMany({
        where: { eventId, tenantId },
        data: {
          status: 'FAILED' as any,
        },
      });
      throw handlerError;
    }
  }
}
