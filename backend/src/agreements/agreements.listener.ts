import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AgreementCreatedEvent,
  AgreementApprovedEvent,
} from './events/agreement.events';

@Injectable()
export class AgreementsListener {
  private readonly logger = new Logger(AgreementsListener.name);

  @OnEvent('agreement.created')
  handleAgreementCreatedEvent(event: AgreementCreatedEvent) {
    this.logger.log(
      `Agreement created: ${event.agreementId} for tenant: ${event.tenantId}`,
    );
    // Future: trigger snapshot, start legal review, etc.
  }

  @OnEvent('agreement.approved')
  handleAgreementApprovedEvent(event: AgreementApprovedEvent) {
    this.logger.log(
      `Agreement approved: ${event.agreementId} for tenant: ${event.tenantId}`,
    );
    // Future: auto-generate receipt or emit to financial review
  }
}
