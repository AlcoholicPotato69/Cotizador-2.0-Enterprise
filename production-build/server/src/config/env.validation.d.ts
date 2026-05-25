export declare enum SignatureMode {
    INTERNAL = "INTERNAL",
    DOCUSIGN = "DOCUSIGN"
}
export declare enum InvoiceMode {
    INTERNAL = "INTERNAL",
    INTELISIS = "INTELISIS"
}
declare class EnvironmentVariables {
    NODE_ENV?: 'development' | 'production' | 'test';
    SIGNATURE_MODE?: SignatureMode;
    INVOICE_MODE?: InvoiceMode;
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
