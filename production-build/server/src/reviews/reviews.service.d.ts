import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto, AddDecisionDto } from './dto/create-review.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private readonly repository;
    private readonly prisma;
    private readonly eventEmitter;
    constructor(repository: ReviewsRepository, prisma: PrismaService, eventEmitter: EventEmitter2);
    createReview(tenantId: string, dto: CreateReviewDto, userId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.DocumentReviewStatus;
        documentId: string;
    }>;
    addDecision(tenantId: string, reviewId: string, dto: AddDecisionDto, userId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        reviewerId: string;
        decidedAt: Date;
        comments: string | null;
        documentReviewId: string;
        decision: import(".prisma/client").$Enums.ReviewDecision;
    }>;
}
