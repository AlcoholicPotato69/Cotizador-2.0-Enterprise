"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReviewsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const reviews_events_1 = require("./events/reviews.events");
const reviews_service_1 = require("./reviews.service");
const agreement_events_1 = require("../agreements/events/agreement.events");
let ReviewsListener = ReviewsListener_1 = class ReviewsListener {
    reviewsService;
    logger = new common_1.Logger(ReviewsListener_1.name);
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async handleAgreementSubmitted(event) {
        this.logger.log(`Agreement submitted for review: ${event.agreementId}. Creating Legal & Financial Reviews...`);
        try {
            await this.reviewsService.createReview(event.tenantId, {
                documentId: event.agreementId,
                type: 'LEGAL'
            }, 'SYSTEM');
            await this.reviewsService.createReview(event.tenantId, {
                documentId: event.agreementId,
                type: 'FINANCIAL'
            }, 'SYSTEM');
        }
        catch (error) {
            this.logger.error(`Failed to create reviews for agreement ${event.agreementId}`, error.stack);
        }
    }
    handleReviewCreated(event) {
        this.logger.log(`Review ${event.reviewId} created for document ${event.documentId} [Type: ${event.type}]`);
    }
    handleReviewDecisionMade(event) {
        this.logger.log(`Review decision made for ${event.reviewId}: ${event.decision}`);
    }
};
exports.ReviewsListener = ReviewsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('agreement.submitted_for_review'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agreement_events_1.AgreementSubmittedForReviewEvent]),
    __metadata("design:returntype", Promise)
], ReviewsListener.prototype, "handleAgreementSubmitted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('review.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviews_events_1.ReviewCreatedEvent]),
    __metadata("design:returntype", void 0)
], ReviewsListener.prototype, "handleReviewCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('review.decision.made'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviews_events_1.ReviewDecisionMadeEvent]),
    __metadata("design:returntype", void 0)
], ReviewsListener.prototype, "handleReviewDecisionMade", null);
exports.ReviewsListener = ReviewsListener = ReviewsListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsListener);
//# sourceMappingURL=reviews.listener.js.map