"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
let ComplianceService = class ComplianceService {
    canCreateContract(client) {
        if (client.isContractBlocked) {
            throw new common_1.ForbiddenException('COMPLIANCE_ERROR: El cliente tiene bloqueada la creación de contratos.');
        }
        if (client.status === 'BLACKLISTED' || client.status === 'ARCHIVED') {
            throw new common_1.ForbiddenException(`COMPLIANCE_ERROR: Operación no permitida para estado ${client.status}.`);
        }
        return true;
    }
    canGenerateInvoice(client) {
        if (client.isInvoiceBlocked) {
            throw new common_1.ForbiddenException('COMPLIANCE_ERROR: El cliente tiene bloqueada la facturación.');
        }
        if (!client.isTaxValidated) {
            throw new common_1.ForbiddenException('COMPLIANCE_ERROR: Información fiscal no validada.');
        }
        return true;
    }
    canApprovePayment(client) {
        if (client.isPaymentBlocked) {
            throw new common_1.ForbiddenException('COMPLIANCE_ERROR: El cliente tiene bloqueados los pagos.');
        }
        return true;
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)()
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map