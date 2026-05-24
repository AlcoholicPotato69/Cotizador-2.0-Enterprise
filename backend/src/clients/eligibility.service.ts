import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientStatus } from '@prisma/client';
import { tenantContext } from '../prisma/tenant-context';

import { ClientsRepository } from './clients.repository';

export enum TransactionType {
  QUOTE_CREATION = 'QUOTE_CREATION',
  CONTRACT_GENERATION = 'CONTRACT_GENERATION',
  INVOICE_GENERATION = 'INVOICE_GENERATION',
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING'
}

@Injectable()
export class EligibilityEngineService {
  constructor(private readonly clientsRepo: ClientsRepository) {}

  async evaluateEligibility(clientId: string, transactionType: TransactionType): Promise<boolean> {
    const ctx = tenantContext.getStore();
    const tenantId = ctx?.tenantId;

    if (!tenantId) {
      throw new ForbiddenException('Tenant context required for eligibility check');
    }

    // Buscamos explícitamente por ID y tenant_id, resolviendo la vulnerabilidad de BOLA
    const client = await this.clientsRepo.findFirst({
      id: clientId,
      tenantId: tenantId
    });

    if (!client) {
      throw new NotFoundException(`Client ${clientId} not found in current tenant`);
    }

    if (client.status === ClientStatus.INACTIVE || client.status === ClientStatus.ARCHIVED || client.status === ClientStatus.BLACKLISTED) {
      throw new ForbiddenException(`Client ${clientId} is in a non-eligible status: ${client.status}`);
    }

    switch (transactionType) {
      case TransactionType.CONTRACT_GENERATION:
        if (client.isContractBlocked) {
          throw new ForbiddenException(`Client ${clientId} is blocked from generating new contracts`);
        }
        break;
      case TransactionType.INVOICE_GENERATION:
        if (client.isInvoiceBlocked) {
          throw new ForbiddenException(`Client ${clientId} is blocked from generating new invoices`);
        }
        break;
      case TransactionType.PAYMENT_PROCESSING:
        if (client.isPaymentBlocked) {
          throw new ForbiddenException(`Client ${clientId} is blocked from processing payments`);
        }
        break;
      case TransactionType.QUOTE_CREATION:
        // Reglas fiscales obligatorias: No se pueden cotizar clientes que no han sido validados fiscalmente
        if (!client.isTaxValidated) {
          throw new ForbiddenException(`Client ${clientId} is not tax validated. Cannot create quotes.`);
        }
        break;
    }

    return true;
  }
}
