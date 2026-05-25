// ============================================
// AGREEMENT ENGINE - Domain Events
// ============================================
export class AgreementCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
    public readonly clientId: string,
    public readonly type: string,
  ) {}
}

export class AgreementSubmittedForReviewEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
  ) {}
}

export class AgreementApprovedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
    public readonly approverId: string,
  ) {}
}

export class AgreementRejectedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
    public readonly reason: string,
  ) {}
}

export class AgreementLetterGeneratedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
    public readonly versionId: string,
  ) {}
}

export class AgreementPendingSignatureEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
  ) {}
}

export class AgreementSignedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
    public readonly signatureId: string,
  ) {}
}

export class AgreementActivatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
    public readonly validFrom: Date,
    public readonly validUntil: Date,
  ) {}
}

export class AgreementCompletedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
  ) {}
}

export class AgreementCancelledEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
    public readonly reason: string,
  ) {}
}

export class AgreementSnapshotCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly agreementId: string,
    public readonly snapshotId: string,
  ) {}
}
