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
exports.InvoiceMode = exports.SignatureMode = void 0;
exports.validate = validate;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var SignatureMode;
(function (SignatureMode) {
    SignatureMode["INTERNAL"] = "INTERNAL";
    SignatureMode["DOCUSIGN"] = "DOCUSIGN";
})(SignatureMode || (exports.SignatureMode = SignatureMode = {}));
var InvoiceMode;
(function (InvoiceMode) {
    InvoiceMode["INTERNAL"] = "INTERNAL";
    InvoiceMode["INTELISIS"] = "INTELISIS";
})(InvoiceMode || (exports.InvoiceMode = InvoiceMode = {}));
class EnvironmentVariables {
    NODE_ENV = 'development';
    SIGNATURE_MODE = SignatureMode.INTERNAL;
    INVOICE_MODE = InvoiceMode.INTERNAL;
    DATABASE_URL;
    JWT_SECRET;
    JWT_EXPIRES_IN = '1d';
}
__decorate([
    (0, class_validator_1.IsEnum)(['development', 'production', 'test']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "NODE_ENV", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(SignatureMode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "SIGNATURE_MODE", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(InvoiceMode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "INVOICE_MODE", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "DATABASE_URL", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "JWT_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "JWT_EXPIRES_IN", void 0);
function validate(config) {
    const validatedConfig = (0, class_transformer_1.plainToInstance)(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = (0, class_validator_1.validateSync)(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
//# sourceMappingURL=env.validation.js.map