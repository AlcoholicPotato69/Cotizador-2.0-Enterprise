"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDecisionMadeEvent = exports.ReviewCreatedEvent = void 0;
class ReviewCreatedEvent {
    tenantId;
    reviewId;
    documentId;
    type;
    constructor(tenantId, reviewId, documentId, type) {
        this.tenantId = tenantId;
        this.reviewId = reviewId;
        this.documentId = documentId;
        this.type = type;
    }
}
exports.ReviewCreatedEvent = ReviewCreatedEvent;
class ReviewDecisionMadeEvent {
    tenantId;
    reviewId;
    decision;
    constructor(tenantId, reviewId, decision) {
        this.tenantId = tenantId;
        this.reviewId = reviewId;
        this.decision = decision;
    }
}
exports.ReviewDecisionMadeEvent = ReviewDecisionMadeEvent;
//# sourceMappingURL=reviews.events.js.map