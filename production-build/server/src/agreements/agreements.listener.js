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
var AgreementsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const agreement_events_1 = require("./events/agreement.events");
let AgreementsListener = AgreementsListener_1 = class AgreementsListener {
    logger = new common_1.Logger(AgreementsListener_1.name);
    handleAgreementCreatedEvent(event) {
        this.logger.log(`Agreement created: ${event.agreementId} for tenant: ${event.tenantId}`);
    }
    handleAgreementApprovedEvent(event) {
        this.logger.log(`Agreement approved: ${event.agreementId} for tenant: ${event.tenantId}`);
    }
};
exports.AgreementsListener = AgreementsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('agreement.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agreement_events_1.AgreementCreatedEvent]),
    __metadata("design:returntype", void 0)
], AgreementsListener.prototype, "handleAgreementCreatedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('agreement.approved'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agreement_events_1.AgreementApprovedEvent]),
    __metadata("design:returntype", void 0)
], AgreementsListener.prototype, "handleAgreementApprovedEvent", null);
exports.AgreementsListener = AgreementsListener = AgreementsListener_1 = __decorate([
    (0, common_1.Injectable)()
], AgreementsListener);
//# sourceMappingURL=agreements.listener.js.map