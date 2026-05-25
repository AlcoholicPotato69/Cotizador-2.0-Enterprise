import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AgreementsRepository } from './agreements.repository';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import {
  AgreementCreatedEvent,
  AgreementSubmittedForReviewEvent,
  AgreementApprovedEvent,
  AgreementRejectedEvent,
  AgreementLetterGeneratedEvent,
  AgreementPendingSignatureEvent,
  AgreementSignedEvent,
  AgreementActivatedEvent,
  AgreementCompletedEvent,
  AgreementCancelledEvent,
} from './events/agreement.events';
import { AgreementStatusEnum } from '@prisma/client';

@Injectable()
export class AgreementsService {
  constructor(
    private readonly repository: AgreementsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(tenantId: string, dto: CreateAgreementDto, userId: string) {
    const agreement = await this.repository.create({
      tenantId,
      clientId: dto.clientId,
      title: 'Agreement Document',
      type: dto.type as any,
      description: dto.description,
      validFrom: dto.validFrom,
      validUntil: dto.validUntil,
      value: dto.value,
      status: AgreementStatusEnum.DRAFT,
    });

    this.eventEmitter.emit(
      'agreement.created',
      new AgreementCreatedEvent(
        tenantId,
        agreement.id,
        agreement.clientId,
        dto.type,
      ),
    );

    return agreement;
  }

  async submitForReview(tenantId: string, id: string, userId: string) {
    const agreement = await this.repository.update(tenantId, id, {
      status: AgreementStatusEnum.UNDER_REVIEW,
    });
    this.eventEmitter.emit(
      'agreement.submitted_for_review',
      new AgreementSubmittedForReviewEvent(tenantId, agreement.id),
    );
    return agreement;
  }

  async approve(tenantId: string, id: string, userId: string) {
    const agreement = await this.repository.update(tenantId, id, {
      status: AgreementStatusEnum.APPROVED,
    });
    this.eventEmitter.emit(
      'agreement.approved',
      new AgreementApprovedEvent(tenantId, agreement.id, userId),
    );
    return agreement;
  }

  async reject(tenantId: string, id: string, userId: string, reason: string) {
    const agreement = await this.repository.update(tenantId, id, {
      status: AgreementStatusEnum.REJECTED,
    });
    this.eventEmitter.emit(
      'agreement.rejected',
      new AgreementRejectedEvent(tenantId, agreement.id, reason),
    );
    return agreement;
  }

  async generateLetter(tenantId: string, id: string, versionId: string) {
    const agreement = await this.repository.update(tenantId, id, {
      status: AgreementStatusEnum.LETTER_GENERATED,
    });
    this.eventEmitter.emit(
      'agreement.letter_generated',
      new AgreementLetterGeneratedEvent(tenantId, agreement.id, versionId),
    );
    return agreement;
  }

  async pendingSignature(tenantId: string, id: string) {
    const agreement = await this.repository.update(tenantId, id, {
      status: AgreementStatusEnum.PENDING_SIGNATURE,
    });
    this.eventEmitter.emit(
      'agreement.pending_signature',
      new AgreementPendingSignatureEvent(tenantId, agreement.id),
    );
    return agreement;
  }

  async markAsSigned(tenantId: string, id: string, signatureId: string) {
    const agreement = await this.repository.update(tenantId, id, {
      status: AgreementStatusEnum.SIGNED,
    });
    this.eventEmitter.emit(
      'agreement.signed',
      new AgreementSignedEvent(tenantId, agreement.id, signatureId),
    );
    return agreement;
  }

  async activate(
    tenantId: string,
    id: string,
    validFrom: Date,
    validUntil: Date,
  ) {
    const agreement = await this.repository.update(tenantId, id, {
      status: AgreementStatusEnum.ACTIVE,
      validFrom,
      validUntil,
    });
    this.eventEmitter.emit(
      'agreement.activated',
      new AgreementActivatedEvent(
        tenantId,
        agreement.id,
        validFrom,
        validUntil,
      ),
    );
    return agreement;
  }

  async complete(tenantId: string, id: string) {
    const agreement = await this.repository.update(tenantId, id, {
      status: AgreementStatusEnum.COMPLETED,
    });
    this.eventEmitter.emit(
      'agreement.completed',
      new AgreementCompletedEvent(tenantId, agreement.id),
    );
    return agreement;
  }

  async cancel(tenantId: string, id: string, reason: string) {
    const agreement = await this.repository.update(tenantId, id, {
      status: AgreementStatusEnum.CANCELLED,
    });
    this.eventEmitter.emit(
      'agreement.cancelled',
      new AgreementCancelledEvent(tenantId, agreement.id, reason),
    );
    return agreement;
  }
}
