"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentPolicyService = void 0;
const common_1 = require("@nestjs/common");
let DocumentPolicyService = class DocumentPolicyService {
    canDelete(document) {
        if (document.legalHold) {
            throw new common_1.ForbiddenException('POLICY_ERROR: El documento está sujeto a Retención Legal (Legal Hold). Borrado lógico y físico bloqueado.');
        }
        return true;
    }
    canArchive(document) {
        return true;
    }
    canPurge(document) {
        this.canDelete(document);
        if (document.retentionUntil && new Date() < document.retentionUntil) {
            throw new common_1.ForbiddenException(`POLICY_ERROR: Periodo de retención legal activo hasta ${document.retentionUntil.toISOString()}`);
        }
        return true;
    }
};
exports.DocumentPolicyService = DocumentPolicyService;
exports.DocumentPolicyService = DocumentPolicyService = __decorate([
    (0, common_1.Injectable)()
], DocumentPolicyService);
//# sourceMappingURL=document-policy.service.js.map