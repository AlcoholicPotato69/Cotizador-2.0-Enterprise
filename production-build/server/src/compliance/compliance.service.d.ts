export declare class ComplianceEngineService {
    canCreateContract(clientSnapshotId: string): Promise<boolean>;
    canGenerateInvoice(contractSnapshotId: string): Promise<boolean>;
    canProcessPayment(invoiceId: string): Promise<boolean>;
}
