import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { tenantContext } from './tenant-context';
import { withOutbox } from '../common/outbox/prisma-outbox.extension';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public readonly extended: ReturnType<typeof withOutbox>;

  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
      log: ['error', 'warn'],
    });
    this.extended = withOutbox(this);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('[PrismaService] Conectado exitosamente a la base de datos.');
    } catch (error) {
      console.error('[PrismaService] No se pudo conectar a la base de datos al arrancar. El backend iniciará con funcionalidades limitadas hasta que la BD responda.', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
