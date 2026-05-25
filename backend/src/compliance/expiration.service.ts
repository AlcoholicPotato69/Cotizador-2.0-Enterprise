import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpirationEngineService {
  private readonly logger = new Logger(ExpirationEngineService.name);

  // El tx inyectado es delegado por el SchedulerWorker (aislado del HTTP)
  async scanExpirations(tx: Prisma.TransactionClient) {
    this.logger.log(
      'Escaneando expiraciones de documentos y configs fiscales...',
    );

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // 1. Barrer Documentos
    const expiringDocuments = await tx.document.findMany({
      where: {
        retentionUntil: {
          lte: thirtyDaysFromNow,
          gte: now,
        },
      },
    });

    this.logger.log(
      `Found ${expiringDocuments.length} documents expiring soon.`,
    );

    if (expiringDocuments.length > 0) {
      await tx.notificationQueue.createMany({
        data: expiringDocuments.map((doc) => ({
          tenantId: doc.tenantId,
          type: 'DOCUMENT_EXPIRATION_WARNING',
          recipient: 'TENANT_ADMIN',
          payload: {
            documentId: doc.id,
            retentionUntil: doc.retentionUntil,
            message: `Document ${doc.id} retention period will expire soon.`,
          },
          status: 'PENDING',
        })),
      });
    }

    // 2. Barrer configuraciones fiscales
    const expiringTaxes = await tx.taxConfiguration.findMany({
      where: {
        validUntil: {
          lte: thirtyDaysFromNow,
          gte: now,
        },
      },
    });

    this.logger.log(
      `Found ${expiringTaxes.length} tax configurations expiring soon.`,
    );

    if (expiringTaxes.length > 0) {
      await tx.notificationQueue.createMany({
        data: expiringTaxes.map((tax) => ({
          tenantId: tax.tenantId,
          type: 'TAX_CONFIG_EXPIRATION_WARNING',
          recipient: 'FINANCE_MANAGER',
          payload: {
            taxId: tax.id,
            taxName: tax.taxName,
            validUntil: tax.validUntil,
            message: `Tax configuration ${tax.taxName} validity will expire soon.`,
          },
          status: 'PENDING',
        })),
      });
    }

    this.logger.log('Escaneo de expiraciones finalizado.');
  }
}
