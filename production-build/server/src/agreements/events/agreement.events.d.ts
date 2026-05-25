export declare class AgreementCreatedEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    readonly clientId: string;
    readonly type: string;
    constructor(tenantId: string, agreementId: string, clientId: string, type: string);
}
export declare class AgreementSubmittedForReviewEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    constructor(tenantId: string, agreementId: string);
}
export declare class AgreementApprovedEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    readonly approverId: string;
    constructor(tenantId: string, agreementId: string, approverId: string);
}
export declare class AgreementRejectedEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    readonly reason: string;
    constructor(tenantId: string, agreementId: string, reason: string);
}
export declare class AgreementLetterGeneratedEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    readonly versionId: string;
    constructor(tenantId: string, agreementId: string, versionId: string);
}
export declare class AgreementPendingSignatureEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    constructor(tenantId: string, agreementId: string);
}
export declare class AgreementSignedEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    readonly signatureId: string;
    constructor(tenantId: string, agreementId: string, signatureId: string);
}
export declare class AgreementActivatedEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    readonly validFrom: Date;
    readonly validUntil: Date;
    constructor(tenantId: string, agreementId: string, validFrom: Date, validUntil: Date);
}
export declare class AgreementCompletedEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    constructor(tenantId: string, agreementId: string);
}
export declare class AgreementCancelledEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    readonly reason: string;
    constructor(tenantId: string, agreementId: string, reason: string);
}
export declare class AgreementSnapshotCreatedEvent {
    readonly tenantId: string;
    readonly agreementId: string;
    readonly snapshotId: string;
    constructor(tenantId: string, agreementId: string, snapshotId: string);
}
