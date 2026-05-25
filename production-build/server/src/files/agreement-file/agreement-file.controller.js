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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementFileController = void 0;
const common_1 = require("@nestjs/common");
const agreement_file_service_1 = require("./agreement-file.service");
const agreement_file_dto_1 = require("./agreement-file.dto");
let AgreementFileController = class AgreementFileController {
    agreementFileService;
    constructor(agreementFileService) {
        this.agreementFileService = agreementFileService;
    }
    async createAgreementFile(tenantId, dto) {
        if (!tenantId)
            throw new common_1.UnauthorizedException('Tenant ID is required');
        return this.agreementFileService.createAgreementFile(tenantId, dto);
    }
    async getAgreementFiles(tenantId, agreementId) {
        if (!tenantId)
            throw new common_1.UnauthorizedException('Tenant ID is required');
        return this.agreementFileService.getAgreementFiles(tenantId, agreementId);
    }
};
exports.AgreementFileController = AgreementFileController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agreement_file_dto_1.CreateAgreementFileDto]),
    __metadata("design:returntype", Promise)
], AgreementFileController.prototype, "createAgreementFile", null);
__decorate([
    (0, common_1.Get)('agreement/:agreementId'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('agreementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AgreementFileController.prototype, "getAgreementFiles", null);
exports.AgreementFileController = AgreementFileController = __decorate([
    (0, common_1.Controller)('agreement-files'),
    __metadata("design:paramtypes", [agreement_file_service_1.AgreementFileService])
], AgreementFileController);
//# sourceMappingURL=agreement-file.controller.js.map