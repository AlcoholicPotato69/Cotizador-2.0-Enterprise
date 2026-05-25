import { ReviewsService } from './reviews.service';
import { CreateReviewDto, AddDecisionDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(user: any, dto: CreateReviewDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.DocumentReviewStatus;
        documentId: string;
    }>;
    addDecision(user: any, id: string, dto: AddDecisionDto): Promise<{
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
