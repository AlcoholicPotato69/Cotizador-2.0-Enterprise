import { ReviewCreatedEvent, ReviewDecisionMadeEvent } from './events/reviews.events';
import { ReviewsService } from './reviews.service';
import { AgreementSubmittedForReviewEvent } from '../agreements/events/agreement.events';
export declare class ReviewsListener {
    private readonly reviewsService;
    private readonly logger;
    constructor(reviewsService: ReviewsService);
    handleAgreementSubmitted(event: AgreementSubmittedForReviewEvent): Promise<void>;
    handleReviewCreated(event: ReviewCreatedEvent): void;
    handleReviewDecisionMade(event: ReviewDecisionMadeEvent): void;
}
