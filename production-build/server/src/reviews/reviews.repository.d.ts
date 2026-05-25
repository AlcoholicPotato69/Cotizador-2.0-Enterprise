import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ReviewsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createReview(data: Prisma.DocumentReviewUncheckedCreateInput): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.DocumentReviewStatus;
        documentId: string;
    }>;
    addReviewStep(data: Prisma.DocumentReviewStepUncheckedCreateInput): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.DocumentReviewStatus;
        stepOrder: number;
        assigneeId: string | null;
        documentReviewId: string;
    }>;
    addReviewDecision(data: Prisma.DocumentReviewDecisionUncheckedCreateInput): Promise<{
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
    updateReview(tenantId: string, id: string, data: Prisma.DocumentReviewUncheckedUpdateInput): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.DocumentReviewStatus;
        documentId: string;
    }>;
}
