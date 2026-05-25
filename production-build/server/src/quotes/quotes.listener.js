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
var QuotesListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotesListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const quotes_service_1 = require("./quotes.service");
const tenant_context_1 = require("../prisma/tenant-context");
const client_1 = require("@prisma/client");
let QuotesListener = QuotesListener_1 = class QuotesListener {
    quotesService;
    logger = new common_1.Logger(QuotesListener_1.name);
    constructor(quotesService) {
        this.quotesService = quotesService;
    }
    async handleContractGenerated(event) {
        if (!event || !event.tenantId || !event.payload)
            return;
        const { quoteId } = event.payload;
        tenant_context_1.tenantContext.run({ tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' }, async () => {
            try {
                await this.quotesService.updateStatus(quoteId, client_1.QuoteStatus.CONTRACT_GENERATED);
                this.logger.log(`Quote status updated to CONTRACT_GENERATED for quote: ${quoteId}`);
            }
            catch (error) {
                this.logger.error(`Failed to update quote status for quote: ${quoteId}`, error);
            }
        });
    }
};
exports.QuotesListener = QuotesListener;
__decorate([
    (0, event_emitter_1.OnEvent)('contract.generated', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotesListener.prototype, "handleContractGenerated", null);
exports.QuotesListener = QuotesListener = QuotesListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [quotes_service_1.QuotesService])
], QuotesListener);
//# sourceMappingURL=quotes.listener.js.map