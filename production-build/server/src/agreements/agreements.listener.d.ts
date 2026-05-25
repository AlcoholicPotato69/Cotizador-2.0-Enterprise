import { AgreementCreatedEvent, AgreementApprovedEvent } from './events/agreement.events';
export declare class AgreementsListener {
    private readonly logger;
    handleAgreementCreatedEvent(event: AgreementCreatedEvent): void;
    handleAgreementApprovedEvent(event: AgreementApprovedEvent): void;
}
