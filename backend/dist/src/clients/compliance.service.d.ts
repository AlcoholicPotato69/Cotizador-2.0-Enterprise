export interface Client {
    status: string;
    isTaxValidated: boolean;
    isContractBlocked: boolean;
    isInvoiceBlocked: boolean;
    isPaymentBlocked: boolean;
}
export declare class ComplianceService {
    canCreateContract(client: Client): boolean;
    canGenerateInvoice(client: Client): boolean;
    canApprovePayment(client: Client): boolean;
}
