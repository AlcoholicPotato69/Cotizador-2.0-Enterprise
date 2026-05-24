import { FsmValidator } from './fsm.validator';
import { BadRequestException } from '@nestjs/common';
import { QuoteStatus, ContractStatus, InvoiceStatus } from '@prisma/client';

describe('FsmValidator', () => {
  let validator: FsmValidator;

  beforeEach(() => {
    validator = new FsmValidator();
  });

  describe('Quote state transitions', () => {
    it('should allow valid transitions', () => {
      expect(() => validator.validateTransition('Quote', QuoteStatus.DRAFT, QuoteStatus.SENT)).not.toThrow();
      expect(() => validator.validateTransition('Quote', QuoteStatus.SENT, QuoteStatus.APPROVED)).not.toThrow();
      expect(() => validator.validateTransition('Quote', QuoteStatus.APPROVED, QuoteStatus.CONTRACT_GENERATED)).not.toThrow();
    });

    it('should throw on invalid transitions', () => {
      expect(() => validator.validateTransition('Quote', QuoteStatus.DRAFT, QuoteStatus.APPROVED))
        .toThrow(BadRequestException);
      expect(() => validator.validateTransition('Quote', QuoteStatus.REJECTED, QuoteStatus.DRAFT))
        .toThrow(BadRequestException);
    });

    it('should throw on unknown current state', () => {
      expect(() => validator.validateTransition('Quote', 'UNKNOWN_STATE', QuoteStatus.SENT))
        .toThrow(BadRequestException);
    });
  });

  describe('Contract state transitions', () => {
    it('should allow valid transitions', () => {
      expect(() => validator.validateTransition('Contract', ContractStatus.DRAFT, ContractStatus.PENDING_SIGNATURE)).not.toThrow();
      expect(() => validator.validateTransition('Contract', ContractStatus.PENDING_SIGNATURE, ContractStatus.SIGNED)).not.toThrow();
      expect(() => validator.validateTransition('Contract', ContractStatus.ACTIVE, ContractStatus.TERMINATED)).not.toThrow();
    });

    it('should throw on invalid transitions', () => {
      expect(() => validator.validateTransition('Contract', ContractStatus.DRAFT, ContractStatus.ACTIVE))
        .toThrow(BadRequestException);
      expect(() => validator.validateTransition('Contract', ContractStatus.EXPIRED, ContractStatus.ACTIVE))
        .toThrow(BadRequestException);
    });
  });

  describe('Invoice state transitions', () => {
    it('should allow valid transitions', () => {
      expect(() => validator.validateTransition('Invoice', InvoiceStatus.DRAFT, InvoiceStatus.GENERATING)).not.toThrow();
      expect(() => validator.validateTransition('Invoice', InvoiceStatus.GENERATING, InvoiceStatus.STAMPING)).not.toThrow();
      expect(() => validator.validateTransition('Invoice', InvoiceStatus.SENT, InvoiceStatus.PAID)).not.toThrow();
      expect(() => validator.validateTransition('Invoice', InvoiceStatus.OVERDUE, InvoiceStatus.PAID)).not.toThrow();
    });

    it('should throw on invalid transitions', () => {
      expect(() => validator.validateTransition('Invoice', InvoiceStatus.DRAFT, InvoiceStatus.PAID))
        .toThrow(BadRequestException);
      expect(() => validator.validateTransition('Invoice', InvoiceStatus.PAID, InvoiceStatus.DRAFT))
        .toThrow(BadRequestException);
    });
  });
});
