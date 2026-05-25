"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementSnapshotCreatedEvent = exports.AgreementCancelledEvent = exports.AgreementCompletedEvent = exports.AgreementActivatedEvent = exports.AgreementSignedEvent = exports.AgreementPendingSignatureEvent = exports.AgreementLetterGeneratedEvent = exports.AgreementRejectedEvent = exports.AgreementApprovedEvent = exports.AgreementSubmittedForReviewEvent = exports.AgreementCreatedEvent = void 0;
class AgreementCreatedEvent {
    tenantId;
    agreementId;
    clientId;
    type;
    constructor(tenantId, agreementId, clientId, type) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
        this.clientId = clientId;
        this.type = type;
    }
}
exports.AgreementCreatedEvent = AgreementCreatedEvent;
class AgreementSubmittedForReviewEvent {
    tenantId;
    agreementId;
    constructor(tenantId, agreementId) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
    }
}
exports.AgreementSubmittedForReviewEvent = AgreementSubmittedForReviewEvent;
class AgreementApprovedEvent {
    tenantId;
    agreementId;
    approverId;
    constructor(tenantId, agreementId, approverId) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
        this.approverId = approverId;
    }
}
exports.AgreementApprovedEvent = AgreementApprovedEvent;
class AgreementRejectedEvent {
    tenantId;
    agreementId;
    reason;
    constructor(tenantId, agreementId, reason) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
        this.reason = reason;
    }
}
exports.AgreementRejectedEvent = AgreementRejectedEvent;
class AgreementLetterGeneratedEvent {
    tenantId;
    agreementId;
    versionId;
    constructor(tenantId, agreementId, versionId) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
        this.versionId = versionId;
    }
}
exports.AgreementLetterGeneratedEvent = AgreementLetterGeneratedEvent;
class AgreementPendingSignatureEvent {
    tenantId;
    agreementId;
    constructor(tenantId, agreementId) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
    }
}
exports.AgreementPendingSignatureEvent = AgreementPendingSignatureEvent;
class AgreementSignedEvent {
    tenantId;
    agreementId;
    signatureId;
    constructor(tenantId, agreementId, signatureId) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
        this.signatureId = signatureId;
    }
}
exports.AgreementSignedEvent = AgreementSignedEvent;
class AgreementActivatedEvent {
    tenantId;
    agreementId;
    validFrom;
    validUntil;
    constructor(tenantId, agreementId, validFrom, validUntil) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
    }
}
exports.AgreementActivatedEvent = AgreementActivatedEvent;
class AgreementCompletedEvent {
    tenantId;
    agreementId;
    constructor(tenantId, agreementId) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
    }
}
exports.AgreementCompletedEvent = AgreementCompletedEvent;
class AgreementCancelledEvent {
    tenantId;
    agreementId;
    reason;
    constructor(tenantId, agreementId, reason) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
        this.reason = reason;
    }
}
exports.AgreementCancelledEvent = AgreementCancelledEvent;
class AgreementSnapshotCreatedEvent {
    tenantId;
    agreementId;
    snapshotId;
    constructor(tenantId, agreementId, snapshotId) {
        this.tenantId = tenantId;
        this.agreementId = agreementId;
        this.snapshotId = snapshotId;
    }
}
exports.AgreementSnapshotCreatedEvent = AgreementSnapshotCreatedEvent;
//# sourceMappingURL=agreement.events.js.map