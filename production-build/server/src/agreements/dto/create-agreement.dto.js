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
exports.SignAgreementDto = exports.CancelAgreementDto = exports.RejectAgreementDto = exports.AddAgreementItemsDto = exports.AgreementItemDto = exports.UpdateAgreementDto = exports.CreateAgreementDto = exports.AgreementStatus = exports.AgreementType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var AgreementType;
(function (AgreementType) {
    AgreementType["PATROCINIO"] = "PATROCINIO";
    AgreementType["INTERCAMBIO"] = "INTERCAMBIO";
    AgreementType["CORTESIA"] = "CORTESIA";
    AgreementType["DESCUENTO"] = "DESCUENTO";
    AgreementType["COLABORACION"] = "COLABORACION";
})(AgreementType || (exports.AgreementType = AgreementType = {}));
var AgreementStatus;
(function (AgreementStatus) {
    AgreementStatus["DRAFT"] = "DRAFT";
    AgreementStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    AgreementStatus["APPROVED"] = "APPROVED";
    AgreementStatus["LETTER_GENERATED"] = "LETTER_GENERATED";
    AgreementStatus["PENDING_SIGNATURE"] = "PENDING_SIGNATURE";
    AgreementStatus["SIGNED"] = "SIGNED";
    AgreementStatus["ACTIVE"] = "ACTIVE";
    AgreementStatus["COMPLETED"] = "COMPLETED";
    AgreementStatus["REJECTED"] = "REJECTED";
    AgreementStatus["CANCELLED"] = "CANCELLED";
})(AgreementStatus || (exports.AgreementStatus = AgreementStatus = {}));
class CreateAgreementDto {
    clientId;
    type;
    title;
    description;
    validFrom;
    validUntil;
    value;
}
exports.CreateAgreementDto = CreateAgreementDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAgreementDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(AgreementType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAgreementDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAgreementDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAgreementDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateAgreementDto.prototype, "validFrom", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateAgreementDto.prototype, "validUntil", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAgreementDto.prototype, "value", void 0);
class UpdateAgreementDto {
    title;
    description;
    validFrom;
    validUntil;
    value;
}
exports.UpdateAgreementDto = UpdateAgreementDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAgreementDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAgreementDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateAgreementDto.prototype, "validFrom", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateAgreementDto.prototype, "validUntil", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAgreementDto.prototype, "value", void 0);
class AgreementItemDto {
    description;
}
exports.AgreementItemDto = AgreementItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AgreementItemDto.prototype, "description", void 0);
class AddAgreementItemsDto {
    items;
}
exports.AddAgreementItemsDto = AddAgreementItemsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AgreementItemDto),
    __metadata("design:type", Array)
], AddAgreementItemsDto.prototype, "items", void 0);
class RejectAgreementDto {
    reason;
}
exports.RejectAgreementDto = RejectAgreementDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RejectAgreementDto.prototype, "reason", void 0);
class CancelAgreementDto {
    reason;
}
exports.CancelAgreementDto = CancelAgreementDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CancelAgreementDto.prototype, "reason", void 0);
class SignAgreementDto {
    signerId;
    signatureData;
}
exports.SignAgreementDto = SignAgreementDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignAgreementDto.prototype, "signerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignAgreementDto.prototype, "signatureData", void 0);
//# sourceMappingURL=create-agreement.dto.js.map