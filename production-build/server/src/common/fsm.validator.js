"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsmValidator = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const TRANSITION_MATRIX = {
    Quote: {
        [client_1.QuoteStatus.DRAFT]: [client_1.QuoteStatus.SENT, client_1.QuoteStatus.REJECTED],
        [client_1.QuoteStatus.SENT]: [client_1.QuoteStatus.APPROVED, client_1.QuoteStatus.REJECTED, client_1.QuoteStatus.EXPIRED],
        [client_1.QuoteStatus.APPROVED]: [client_1.QuoteStatus.CONTRACT_GENERATED, client_1.QuoteStatus.EXPIRED],
        [client_1.QuoteStatus.REJECTED]: [],
        [client_1.QuoteStatus.EXPIRED]: [],
        [client_1.QuoteStatus.CONTRACT_GENERATED]: [],
    },
    Contract: {
        [client_1.ContractStatus.DRAFT]: [client_1.ContractStatus.PENDING_SIGNATURE, client_1.ContractStatus.CANCELLED, client_1.ContractStatus.REJECTED],
        [client_1.ContractStatus.PENDING_SIGNATURE]: [client_1.ContractStatus.SIGNED, client_1.ContractStatus.REJECTED, client_1.ContractStatus.CANCELLED],
        [client_1.ContractStatus.SIGNED]: [client_1.ContractStatus.ACTIVE, client_1.ContractStatus.CANCELLED],
        [client_1.ContractStatus.ACTIVE]: [client_1.ContractStatus.EXPIRED, client_1.ContractStatus.TERMINATED],
        [client_1.ContractStatus.EXPIRED]: [],
        [client_1.ContractStatus.TERMINATED]: [],
        [client_1.ContractStatus.REJECTED]: [],
        [client_1.ContractStatus.CANCELLED]: [],
    },
    Invoice: {
        [client_1.InvoiceStatus.DRAFT]: [client_1.InvoiceStatus.GENERATING, client_1.InvoiceStatus.VOIDED, client_1.InvoiceStatus.STAMPED, client_1.InvoiceStatus.PARTIALLY_PAID, client_1.InvoiceStatus.PAID],
        [client_1.InvoiceStatus.GENERATING]: [client_1.InvoiceStatus.STAMPING, client_1.InvoiceStatus.VOIDED],
        [client_1.InvoiceStatus.STAMPING]: [client_1.InvoiceStatus.STAMPED, client_1.InvoiceStatus.VOIDED],
        [client_1.InvoiceStatus.STAMPED]: [client_1.InvoiceStatus.SENT, client_1.InvoiceStatus.PARTIALLY_PAID, client_1.InvoiceStatus.PAID, client_1.InvoiceStatus.VOIDED],
        [client_1.InvoiceStatus.SENT]: [client_1.InvoiceStatus.PARTIALLY_PAID, client_1.InvoiceStatus.PAID, client_1.InvoiceStatus.OVERDUE, client_1.InvoiceStatus.CANCELLED],
        [client_1.InvoiceStatus.PARTIALLY_PAID]: [client_1.InvoiceStatus.PAID, client_1.InvoiceStatus.OVERDUE],
        [client_1.InvoiceStatus.OVERDUE]: [client_1.InvoiceStatus.PARTIALLY_PAID, client_1.InvoiceStatus.PAID, client_1.InvoiceStatus.VOIDED],
        [client_1.InvoiceStatus.PAID]: [],
        [client_1.InvoiceStatus.VOIDED]: [],
        [client_1.InvoiceStatus.CANCELLED]: [],
    },
    Payment: {
        [client_1.PaymentStatus.DRAFT]: [client_1.PaymentStatus.PENDING],
        [client_1.PaymentStatus.PENDING]: [client_1.PaymentStatus.UNDER_REVIEW, client_1.PaymentStatus.CANCELLED],
        [client_1.PaymentStatus.UNDER_REVIEW]: [client_1.PaymentStatus.APPROVED, client_1.PaymentStatus.REJECTED],
        [client_1.PaymentStatus.APPROVED]: [client_1.PaymentStatus.REFUNDED],
        [client_1.PaymentStatus.REJECTED]: [],
        [client_1.PaymentStatus.CANCELLED]: [],
        [client_1.PaymentStatus.REFUNDED]: [],
    }
};
let FsmValidator = class FsmValidator {
    validateTransition(entityName, currentState, targetState) {
        const allowedTransitions = TRANSITION_MATRIX[entityName][currentState];
        if (!allowedTransitions) {
            throw new common_1.BadRequestException(`Entity ${entityName} has unknown current state: ${currentState}`);
        }
        if (!allowedTransitions.includes(targetState)) {
            throw new common_1.BadRequestException(`Invalid state transition for ${entityName}: ${currentState} -> ${targetState}. Allowed transitions: ${allowedTransitions.join(', ')}`);
        }
    }
    validateSignatureEligibility(currentState) {
        if (![client_1.ContractStatus.DRAFT, client_1.ContractStatus.PENDING_SIGNATURE].includes(currentState)) {
            throw new common_1.BadRequestException(`Cannot add signature to contract in state: ${currentState}`);
        }
    }
    validateInvoiceGenerationEligibility(contractState) {
        if (contractState !== client_1.ContractStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Invoice can only be generated for ACTIVE contracts. Current status: ${contractState}`);
        }
    }
};
exports.FsmValidator = FsmValidator;
exports.FsmValidator = FsmValidator = __decorate([
    (0, common_1.Injectable)()
], FsmValidator);
//# sourceMappingURL=fsm.validator.js.map