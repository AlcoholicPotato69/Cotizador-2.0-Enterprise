export declare class FsmValidator {
    validateTransition(entityName: 'Quote' | 'Contract' | 'Invoice' | 'Payment', currentState: string, targetState: string): void;
    validateSignatureEligibility(currentState: string): void;
    validateInvoiceGenerationEligibility(contractState: string): void;
}
