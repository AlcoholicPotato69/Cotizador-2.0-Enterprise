import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ReviewCreatedEvent,
  ReviewDecisionMadeEvent,
} from './events/reviews.events';
import { ReviewsService } from './reviews.service';
import { AgreementSubmittedForReviewEvent } from '../agreements/events/agreement.events';

@Injectable()
export class ReviewsListener {
  private readonly logger = new Logger(ReviewsListener.name);

  constructor(private readonly reviewsService: ReviewsService) {}

  @OnEvent('agreement.submitted_for_review')
  async handleAgreementSubmitted(event: AgreementSubmittedForReviewEvent) {
    this.logger.log(
      `Agreement submitted for review: ${event.agreementId}. Creating Legal & Financial Reviews...`,
    );
    try {
      // Trigger a LEGAL review
      await this.reviewsService.createReview(
        event.tenantId,
        {
          documentId: event.agreementId,
          type: 'LEGAL',
        },
        'SYSTEM',
      );

      // Trigger a FINANCIAL review
      await this.reviewsService.createReview(
        event.tenantId,
        {
          documentId: event.agreementId,
          type: 'FINANCIAL',
        },
        'SYSTEM',
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to create reviews for agreement ${event.agreementId}`,
        error.stack,
      );
    }
  }

  @OnEvent('review.created')
  handleReviewCreated(event: ReviewCreatedEvent) {
    this.logger.log(
      `Review ${event.reviewId} created for document ${event.documentId} [Type: ${event.type}]`,
    );
    // Future logic: Notify legal/financial team depending on type
  }

  @OnEvent('review.decision.made')
  handleReviewDecisionMade(event: ReviewDecisionMadeEvent) {
    this.logger.log(
      `Review decision made for ${event.reviewId}: ${event.decision}`,
    );
    // Future logic: Transition document state, unlock features
  }
}
