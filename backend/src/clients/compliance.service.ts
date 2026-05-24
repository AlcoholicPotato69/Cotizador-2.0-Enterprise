import { Injectable, ForbiddenException } from '@nestjs/common';

// Interfaz local simulando Prisma Client para evitar fallos de build en esta etapa base
export interface Client {
  status: string;
  isTaxValidated: boolean;
  isContractBlocked: boolean;
  isInvoiceBlocked: boolean;
  isPaymentBlocked: boolean;
}

@Injectable()
export class ComplianceService {
  
  canCreateContract(client: Client): boolean {
    if (client.isContractBlocked) {
      throw new ForbiddenException('COMPLIANCE_ERROR: El cliente tiene bloqueada la creación de contratos.');
    }
    if (client.status === 'BLACKLISTED' || client.status === 'ARCHIVED') {
      throw new ForbiddenException(`COMPLIANCE_ERROR: Operación no permitida para estado ${client.status}.`);
    }
    return true;
  }

  canGenerateInvoice(client: Client): boolean {
    if (client.isInvoiceBlocked) {
      throw new ForbiddenException('COMPLIANCE_ERROR: El cliente tiene bloqueada la facturación.');
    }
    if (!client.isTaxValidated) {
      throw new ForbiddenException('COMPLIANCE_ERROR: Información fiscal no validada.');
    }
    return true;
  }

  canApprovePayment(client: Client): boolean {
    if (client.isPaymentBlocked) {
      throw new ForbiddenException('COMPLIANCE_ERROR: El cliente tiene bloqueados los pagos.');
    }
    return true;
  }
}
