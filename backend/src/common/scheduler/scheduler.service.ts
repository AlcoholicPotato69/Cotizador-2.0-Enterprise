import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { ExpirationEngineService } from '../../compliance/expiration.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly expirationEngine: ExpirationEngineService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async executeNightlySweeps() {
    this.logger.log(
      'Iniciando cron jobs nocturnos desde el SchedulerWorker centralizado...',
    );

    try {
      // El Scheduler centralizado es el ÚNICO componente autorizado a elevar
      // privilegios a SYSTEM_CRON ('staff') para barridos globales.
      await this.prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          SELECT 
            set_config('app.current_tenant_id', '', TRUE),
            set_config('app.current_user_id', 'SYSTEM_CRON', TRUE),
            set_config('app.current_role', 'staff', TRUE)
        `;

        // Llamamos a los motores pasándoles la transacción ya elevada
        // para que no puedan ser invocados de forma autónoma elevando privilegios
        await this.expirationEngine.scanExpirations(tx);

        // Aquí se podrían agregar más sweeps de otros dominios
      });

      this.logger.log('Cron jobs nocturnos completados satisfactoriamente.');
    } catch (error) {
      this.logger.error('Fallo crítico en el Scheduler central:', error);
    }
  }
}
