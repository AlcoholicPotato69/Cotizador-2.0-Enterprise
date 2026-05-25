export declare enum JobType {
    PDF_GENERATION = "PDF",
    EMAIL_NOTIFICATION = "EMAIL",
    INVOICE_PROCESSING = "INVOICE",
    SIGNATURE_REQUEST = "SIGNATURE"
}
export interface JobPayload {
    tenantId: string;
    aggregateId?: string;
    data: Record<string, unknown>;
}
