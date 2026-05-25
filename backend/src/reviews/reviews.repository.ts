import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(data: Prisma.DocumentReviewUncheckedCreateInput) {
    return this.prisma.documentReview.create({ data });
  }

  async addReviewStep(data: Prisma.DocumentReviewStepUncheckedCreateInput) {
    return this.prisma.documentReviewStep.create({ data });
  }

  async addReviewDecision(
    data: Prisma.DocumentReviewDecisionUncheckedCreateInput,
  ) {
    return this.prisma.documentReviewDecision.create({ data });
  }

  async updateReview(
    tenantId: string,
    id: string,
    data: Prisma.DocumentReviewUncheckedUpdateInput,
  ) {
    return this.prisma.documentReview.update({
      where: { id, tenantId },
      data,
    });
  }
}
