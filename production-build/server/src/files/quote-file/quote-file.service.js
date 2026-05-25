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
exports.QuoteFileService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const quote_file_repository_1 = require("./quote-file.repository");
const file_events_1 = require("../events/file.events");
let QuoteFileService = class QuoteFileService {
    repository;
    eventEmitter;
    constructor(repository, eventEmitter) {
        this.repository = repository;
        this.eventEmitter = eventEmitter;
    }
    async createQuoteFile(tenantId, dto) {
        const file = await this.repository.createQuoteFile({
            tenantId,
            quoteId: dto.quoteId,
            url: dto.url,
        });
        this.eventEmitter.emit('quoteFile.created', new file_events_1.QuoteFileCreatedEvent(tenantId, file.id, file.quoteId));
        return file;
    }
    async getQuoteFiles(tenantId, quoteId) {
        return this.repository.findQuoteFiles(tenantId, quoteId);
    }
};
exports.QuoteFileService = QuoteFileService;
exports.QuoteFileService = QuoteFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [quote_file_repository_1.QuoteFileRepository,
        event_emitter_1.EventEmitter2])
], QuoteFileService);
//# sourceMappingURL=quote-file.service.js.map