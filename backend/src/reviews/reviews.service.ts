import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto, AddDecisionDto } from './dto/create-review.dto';
import {
  ReviewCreatedEvent,
  ReviewDecisionMadeEvent,
} from './events/reviews.events';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly repository: ReviewsRepository,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createReview(tenantId: string, dto: CreateReviewDto, userId: string) {
    const review = await this.repository.createReview({
      tenantId,
      documentId: dto.documentId,
      status: 'PENDING',
    });

    // Assume we create a step
    await this.repository.addReviewStep({
      tenantId,
      documentReviewId: review.id,
      stepOrder: 1,
      status: 'PENDING',
    });

    this.eventEmitter.emit(
      'review.created',
      new ReviewCreatedEvent(tenantId, review.id, dto.documentId, dto.type),
    );

    return review;
  }

  async addDecision(
    tenantId: string,
    reviewId: string,
    dto: AddDecisionDto,
    userId: string,
  ) {
    const decision = await this.prisma.$transaction(async (tx) => {
      const currentReview = await tx.documentReview.findUnique({
        where: { id: reviewId, tenantId },
      });

      if (!currentReview) {
        throw new NotFoundException('Review not found');
      }

      if (
        currentReview.status === 'APPROVED' ||
        currentReview.status === 'REJECTED'
      ) {
        throw new BadRequestException('Review already concluded');
      }

      const newDecision = await tx.documentReviewDecision.create({
        data: {
          tenantId,
          documentReviewId: reviewId,
          reviewerId: userId,
          decision: dto.decision as any,
          comments: dto.comments,
        },
      });

      if (dto.decision === 'APPROVED' || dto.decision === 'REJECTED') {
        await tx.documentReview.update({
          where: { id: reviewId, tenantId },
          data: {
            status: dto.decision,
          },
        });
      }

      return newDecision;
    });

    this.eventEmitter.emit(
      'review.decision.made',
      new ReviewDecisionMadeEvent(tenantId, reviewId, dto.decision),
    );

    return decision;
  }
}
