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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    logger = new common_1.Logger(NotificationsService_1.name);
    handleNotificationSendEvent(payload) {
        this.logger.log(`Dispatching notification to user ${payload.userId} in tenant ${payload.tenantId}: ${payload.message}`);
        this.dispatch(payload);
    }
    handleQuoteApproved(payload) {
        this.logger.log(`Quote ${payload.quoteId} approved. Notifying stakeholders.`);
        this.dispatch({
            tenantId: payload.tenantId,
            userId: payload.userId,
            message: `Quote ${payload.quoteId} has been approved.`,
            type: 'QUOTE_APPROVED'
        });
    }
    handleContractGenerated(payload) {
        this.logger.log(`Contract ${payload.contractId} generated for Quote ${payload.quoteId}. Notifying stakeholders.`);
        this.dispatch({
            tenantId: payload.tenantId,
            userId: payload.userId,
            message: `Contract ${payload.contractId} has been generated.`,
            type: 'CONTRACT_GENERATED'
        });
    }
    dispatch(payload) {
        this.logger.debug(`[${payload.type}] -> User: ${payload.userId} | Msg: ${payload.message}`);
    }
    async getNotificationsForUser(tenantId, userId) {
        return [
            { id: '1', message: 'Welcome to the system', type: 'SYSTEM', read: false },
        ];
    }
};
exports.NotificationsService = NotificationsService;
__decorate([
    (0, event_emitter_1.OnEvent)('notification.send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsService.prototype, "handleNotificationSendEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('quote.approved'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsService.prototype, "handleQuoteApproved", null);
__decorate([
    (0, event_emitter_1.OnEvent)('contract.generated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsService.prototype, "handleContractGenerated", null);
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map