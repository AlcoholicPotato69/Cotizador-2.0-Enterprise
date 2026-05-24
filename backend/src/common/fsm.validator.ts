import { Injectable, BadRequestException } from '@nestjs/common';
import { QuoteStatus, ContractStatus, InvoiceStatus, PaymentStatus } from '@prisma/client';

type FsmMap = {
  [entity: string]: {
    [currentState: string]: string[];
  };
};

const TRANSITION_MATRIX: FsmMap = {
  Quote: {
    [QuoteStatus.DRAFT]: [QuoteStatus.SENT, QuoteStatus.REJECTED],
    [QuoteStatus.SENT]: [QuoteStatus.APPROVED, QuoteStatus.REJECTED, QuoteStatus.EXPIRED],
    [QuoteStatus.APPROVED]: [QuoteStatus.CONTRACT_GENERATED, QuoteStatus.EXPIRED],
    [QuoteStatus.REJECTED]: [], // Terminal
    [QuoteStatus.EXPIRED]: [],  // Terminal
    [QuoteStatus.CONTRACT_GENERATED]: [], // Terminal for Quote
  },
  Contract: {
    [ContractStatus.DRAFT]: [ContractStatus.PENDING_SIGNATURE, ContractStatus.CANCELLED, ContractStatus.REJECTED],
    [ContractStatus.PENDING_SIGNATURE]: [ContractStatus.SIGNED, ContractStatus.REJECTED, ContractStatus.CANCELLED],
    [ContractStatus.SIGNED]: [ContractStatus.ACTIVE, ContractStatus.CANCELLED],
    [ContractStatus.ACTIVE]: [ContractStatus.EXPIRED, ContractStatus.TERMINATED],
    [ContractStatus.EXPIRED]: [], // Terminal
    [ContractStatus.TERMINATED]: [], // Terminal
    [ContractStatus.REJECTED]: [], // Terminal
    [ContractStatus.CANCELLED]: [], // Terminal
  },
  Invoice: {
    [InvoiceStatus.DRAFT]: [InvoiceStatus.GENERATING, InvoiceStatus.VOIDED],
    [InvoiceStatus.GENERATING]: [InvoiceStatus.STAMPING, InvoiceStatus.VOIDED],
    [InvoiceStatus.STAMPING]: [InvoiceStatus.STAMPED, InvoiceStatus.VOIDED],
    [InvoiceStatus.STAMPED]: [InvoiceStatus.SENT, InvoiceStatus.VOIDED],
    [InvoiceStatus.SENT]: [InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.CANCELLED],
    [InvoiceStatus.PARTIALLY_PAID]: [InvoiceStatus.PAID, InvoiceStatus.OVERDUE],
    [InvoiceStatus.OVERDUE]: [InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.PAID, InvoiceStatus.VOIDED],
    [InvoiceStatus.PAID]: [], // Terminal
    [InvoiceStatus.VOIDED]: [], // Terminal
    [InvoiceStatus.CANCELLED]: [], // Terminal
  },
  Payment: {
    [PaymentStatus.DRAFT]: [PaymentStatus.PENDING],
    [PaymentStatus.PENDING]: [PaymentStatus.UNDER_REVIEW, PaymentStatus.CANCELLED],
    [PaymentStatus.UNDER_REVIEW]: [PaymentStatus.APPROVED, PaymentStatus.REJECTED],
    [PaymentStatus.APPROVED]: [PaymentStatus.REFUNDED],
    [PaymentStatus.REJECTED]: [], // Terminal
    [PaymentStatus.CANCELLED]: [], // Terminal
    [PaymentStatus.REFUNDED]: [], // Terminal
  }
};

@Injectable()
export class FsmValidator {
  validateTransition(entityName: 'Quote' | 'Contract' | 'Invoice' | 'Payment', currentState: string, targetState: string) {
    const allowedTransitions = TRANSITION_MATRIX[entityName][currentState];
    
    if (!allowedTransitions) {
      throw new BadRequestException(`Entity ${entityName} has unknown current state: ${currentState}`);
    }

    if (!allowedTransitions.includes(targetState)) {
      throw new BadRequestException(
        `Invalid state transition for ${entityName}: ${currentState} -> ${targetState}. Allowed transitions: ${allowedTransitions.join(', ')}`
      );
    }
  }

  validateSignatureEligibility(currentState: string) {
    if (![ContractStatus.DRAFT, ContractStatus.PENDING_SIGNATURE].includes(currentState as any)) {
      throw new BadRequestException(`Cannot add signature to contract in state: ${currentState}`);
    }
  }

  validateInvoiceGenerationEligibility(contractState: string) {
    if (contractState !== ContractStatus.ACTIVE) {
      throw new BadRequestException(`Invoice can only be generated for ACTIVE contracts. Current status: ${contractState}`);
    }
  }
}
