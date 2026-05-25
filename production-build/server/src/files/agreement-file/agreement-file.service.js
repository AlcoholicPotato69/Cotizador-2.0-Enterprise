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
exports.AgreementFileService = exports.AgreementFileCreatedEvent = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const agreement_file_repository_1 = require("./agreement-file.repository");
class AgreementFileCreatedEvent {
    tenantId;
    fileId;
    agreementId;
    constructor(tenantId, fileId, agreementId) {
        this.tenantId = tenantId;
        this.fileId = fileId;
        this.agreementId = agreementId;
    }
}
exports.AgreementFileCreatedEvent = AgreementFileCreatedEvent;
let AgreementFileService = class AgreementFileService {
    repository;
    eventEmitter;
    constructor(repository, eventEmitter) {
        this.repository = repository;
        this.eventEmitter = eventEmitter;
    }
    async createAgreementFile(tenantId, dto) {
        const file = await this.repository.createAgreementFile({
            tenantId,
            agreementId: dto.agreementId,
            url: dto.url,
        });
        this.eventEmitter.emit('agreementFile.created', new AgreementFileCreatedEvent(tenantId, file.id, file.agreementId));
        return file;
    }
    async getAgreementFiles(tenantId, agreementId) {
        return this.repository.findAgreementFiles(tenantId, agreementId);
    }
};
exports.AgreementFileService = AgreementFileService;
exports.AgreementFileService = AgreementFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agreement_file_repository_1.AgreementFileRepository,
        event_emitter_1.EventEmitter2])
], AgreementFileService);
//# sourceMappingURL=agreement-file.service.js.map