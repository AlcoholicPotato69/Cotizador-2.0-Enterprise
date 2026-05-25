export declare enum AgreementType {
    PATROCINIO = "PATROCINIO",
    INTERCAMBIO = "INTERCAMBIO",
    CORTESIA = "CORTESIA",
    DESCUENTO = "DESCUENTO",
    COLABORACION = "COLABORACION"
}
export declare enum AgreementStatus {
    DRAFT = "DRAFT",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    LETTER_GENERATED = "LETTER_GENERATED",
    PENDING_SIGNATURE = "PENDING_SIGNATURE",
    SIGNED = "SIGNED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class CreateAgreementDto {
    clientId: string;
    type: AgreementType;
    title: string;
    description?: string;
    validFrom: Date;
    validUntil: Date;
    value?: number;
}
export declare class UpdateAgreementDto {
    title?: string;
    description?: string;
    validFrom?: Date;
    validUntil?: Date;
    value?: number;
}
export declare class AgreementItemDto {
    description: string;
}
export declare class AddAgreementItemsDto {
    items: AgreementItemDto[];
}
export declare class RejectAgreementDto {
    reason: string;
}
export declare class CancelAgreementDto {
    reason: string;
}
export declare class SignAgreementDto {
    signerId: string;
    signatureData: string;
}
