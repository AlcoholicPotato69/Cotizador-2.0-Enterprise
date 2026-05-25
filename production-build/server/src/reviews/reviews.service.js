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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const reviews_repository_1 = require("./reviews.repository");
const reviews_events_1 = require("./events/reviews.events");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    repository;
    prisma;
    eventEmitter;
    constructor(repository, prisma, eventEmitter) {
        this.repository = repository;
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async createReview(tenantId, dto, userId) {
        const review = await this.repository.createReview({
            tenantId,
            documentId: dto.documentId,
            status: 'PENDING',
        });
        await this.repository.addReviewStep({
            tenantId,
            documentReviewId: review.id,
            stepOrder: 1,
            status: 'PENDING',
        });
        this.eventEmitter.emit('review.created', new reviews_events_1.ReviewCreatedEvent(tenantId, review.id, dto.documentId, dto.type));
        return review;
    }
    async addDecision(tenantId, reviewId, dto, userId) {
        const decision = await this.prisma.$transaction(async (tx) => {
            const currentReview = await tx.documentReview.findUnique({
                where: { id: reviewId, tenantId },
            });
            if (!currentReview) {
                throw new common_1.NotFoundException('Review not found');
            }
            if (currentReview.status === 'APPROVED' || currentReview.status === 'REJECTED') {
                throw new common_1.BadRequestException('Review already concluded');
            }
            const newDecision = await tx.documentReviewDecision.create({
                data: {
                    tenantId,
                    documentReviewId: reviewId,
                    reviewerId: userId,
                    decision: dto.decision,
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
        this.eventEmitter.emit('review.decision.made', new reviews_events_1.ReviewDecisionMadeEvent(tenantId, reviewId, dto.decision));
        return decision;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reviews_repository_1.ReviewsRepository,
        prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map