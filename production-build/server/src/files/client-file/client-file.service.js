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
exports.ClientFileService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const client_file_repository_1 = require("./client-file.repository");
const file_events_1 = require("../events/file.events");
let ClientFileService = class ClientFileService {
    repository;
    eventEmitter;
    constructor(repository, eventEmitter) {
        this.repository = repository;
        this.eventEmitter = eventEmitter;
    }
    async createClientFile(tenantId, dto) {
        const file = await this.repository.createClientFile({
            tenantId,
            clientId: dto.clientId,
            name: dto.name,
        });
        this.eventEmitter.emit('clientFile.created', new file_events_1.ClientFileCreatedEvent(tenantId, file.id, file.clientId));
        return file;
    }
    async getClientFiles(tenantId, clientId) {
        return this.repository.findClientFiles(tenantId, clientId);
    }
    async addDocument(tenantId, clientFileId, dto) {
        const file = await this.repository.findClientFileById(tenantId, clientFileId);
        if (!file) {
            throw new common_1.NotFoundException(`ClientFile with ID ${clientFileId} not found`);
        }
        const document = await this.repository.addDocument({
            tenantId,
            clientFileId,
            url: dto.url,
            documentType: dto.documentType,
        });
        this.eventEmitter.emit('clientFile.documentAdded', new file_events_1.ClientFileDocumentAddedEvent(tenantId, clientFileId, document.id, document.documentType));
        return document;
    }
};
exports.ClientFileService = ClientFileService;
exports.ClientFileService = ClientFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_file_repository_1.ClientFileRepository,
        event_emitter_1.EventEmitter2])
], ClientFileService);
//# sourceMappingURL=client-file.service.js.map