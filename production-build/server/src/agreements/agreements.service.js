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
exports.AgreementsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const agreements_repository_1 = require("./agreements.repository");
const agreement_events_1 = require("./events/agreement.events");
const client_1 = require("@prisma/client");
let AgreementsService = class AgreementsService {
    repository;
    eventEmitter;
    constructor(repository, eventEmitter) {
        this.repository = repository;
        this.eventEmitter = eventEmitter;
    }
    async create(tenantId, dto, userId) {
        const agreement = await this.repository.create({
            tenantId,
            clientId: dto.clientId,
            title: 'Agreement Document',
            type: dto.type,
            description: dto.description,
            validFrom: dto.validFrom,
            validUntil: dto.validUntil,
            value: dto.value,
            status: client_1.AgreementStatusEnum.DRAFT,
        });
        this.eventEmitter.emit('agreement.created', new agreement_events_1.AgreementCreatedEvent(tenantId, agreement.id, agreement.clientId, dto.type));
        return agreement;
    }
    async submitForReview(tenantId, id, userId) {
        const agreement = await this.repository.update(tenantId, id, {
            status: client_1.AgreementStatusEnum.UNDER_REVIEW,
        });
        this.eventEmitter.emit('agreement.submitted_for_review', new agreement_events_1.AgreementSubmittedForReviewEvent(tenantId, agreement.id));
        return agreement;
    }
    async approve(tenantId, id, userId) {
        const agreement = await this.repository.update(tenantId, id, {
            status: client_1.AgreementStatusEnum.APPROVED,
        });
        this.eventEmitter.emit('agreement.approved', new agreement_events_1.AgreementApprovedEvent(tenantId, agreement.id, userId));
        return agreement;
    }
    async reject(tenantId, id, userId, reason) {
        const agreement = await this.repository.update(tenantId, id, {
            status: client_1.AgreementStatusEnum.REJECTED,
        });
        this.eventEmitter.emit('agreement.rejected', new agreement_events_1.AgreementRejectedEvent(tenantId, agreement.id, reason));
        return agreement;
    }
    async generateLetter(tenantId, id, versionId) {
        const agreement = await this.repository.update(tenantId, id, {
            status: client_1.AgreementStatusEnum.LETTER_GENERATED,
        });
        this.eventEmitter.emit('agreement.letter_generated', new agreement_events_1.AgreementLetterGeneratedEvent(tenantId, agreement.id, versionId));
        return agreement;
    }
    async pendingSignature(tenantId, id) {
        const agreement = await this.repository.update(tenantId, id, {
            status: client_1.AgreementStatusEnum.PENDING_SIGNATURE,
        });
        this.eventEmitter.emit('agreement.pending_signature', new agreement_events_1.AgreementPendingSignatureEvent(tenantId, agreement.id));
        return agreement;
    }
    async markAsSigned(tenantId, id, signatureId) {
        const agreement = await this.repository.update(tenantId, id, {
            status: client_1.AgreementStatusEnum.SIGNED,
        });
        this.eventEmitter.emit('agreement.signed', new agreement_events_1.AgreementSignedEvent(tenantId, agreement.id, signatureId));
        return agreement;
    }
    async activate(tenantId, id, validFrom, validUntil) {
        const agreement = await this.repository.update(tenantId, id, {
            status: client_1.AgreementStatusEnum.ACTIVE,
            validFrom,
            validUntil,
        });
        this.eventEmitter.emit('agreement.activated', new agreement_events_1.AgreementActivatedEvent(tenantId, agreement.id, validFrom, validUntil));
        return agreement;
    }
    async complete(tenantId, id) {
        const agreement = await this.repository.update(tenantId, id, {
            status: client_1.AgreementStatusEnum.COMPLETED,
        });
        this.eventEmitter.emit('agreement.completed', new agreement_events_1.AgreementCompletedEvent(tenantId, agreement.id));
        return agreement;
    }
    async cancel(tenantId, id, reason) {
        const agreement = await this.repository.update(tenantId, id, {
            status: client_1.AgreementStatusEnum.CANCELLED,
        });
        this.eventEmitter.emit('agreement.cancelled', new agreement_events_1.AgreementCancelledEvent(tenantId, agreement.id, reason));
        return agreement;
    }
};
exports.AgreementsService = AgreementsService;
exports.AgreementsService = AgreementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agreements_repository_1.AgreementsRepository,
        event_emitter_1.EventEmitter2])
], AgreementsService);
//# sourceMappingURL=agreements.service.js.map