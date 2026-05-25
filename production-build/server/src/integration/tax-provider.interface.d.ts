export interface TaxProvider {
    stamp(invoicePayload: any): Promise<any>;
    cancel(uuid: string, reason: string): Promise<boolean>;
    validate(uuid: string): Promise<boolean>;
}
