"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentViewerService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const client_file_repository_1 = require("../client-file/client-file.repository");
const quote_file_repository_1 = require("../quote-file/quote-file.repository");
const contract_file_repository_1 = require("../contract-file/contract-file.repository");
const agreement_file_repository_1 = require("../agreement-file/agreement-file.repository");
const financial_file_repository_1 = require("../financial-file/financial-file.repository");
let DocumentViewerService = class DocumentViewerService {
    clientFileRepo;
    quoteFileRepo;
    contractFileRepo;
    agreementFileRepo;
    financialFileRepo;
    secretKey;
    constructor(clientFileRepo, quoteFileRepo, contractFileRepo, agreementFileRepo, financialFileRepo) {
        this.clientFileRepo = clientFileRepo;
        this.quoteFileRepo = quoteFileRepo;
        this.contractFileRepo = contractFileRepo;
        this.agreementFileRepo = agreementFileRepo;
        this.financialFileRepo = financialFileRepo;
        const secret = process.env.DOCUMENT_SIGNING_SECRET;
        if (!secret) {
            throw new Error('CRITICAL_ERROR: DOCUMENT_SIGNING_SECRET is not defined in the environment. Hardcoded fallback blocked by forensic audit.');
        }
        this.secretKey = secret;
    }
    generateSignedUrl(tenantId, entityType, fileId, expiresInMinutes = 60) {
        const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
        const payload = `${tenantId}:${entityType}:${fileId}:${expiresAt}`;
        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(payload)
            .digest('hex');
        return `/document-viewer/view?tenantId=${tenantId}&entityType=${entityType}&fileId=${fileId}&expiresAt=${expiresAt}&signature=${signature}`;
    }
    async viewDocument(tenantId, entityType, fileId, expiresAt, signature) {
        if (Date.now() > expiresAt) {
            throw new common_1.UnauthorizedException('Signed URL has expired');
        }
        const payload = `${tenantId}:${entityType}:${fileId}:${expiresAt}`;
        const expectedSignature = crypto
            .createHmac('sha256', this.secretKey)
            .update(payload)
            .digest('hex');
        const signatureBuffer = Buffer.from(signature, 'utf8');
        const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
        if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
            throw new common_1.ForbiddenException('Invalid document signature');
        }
        let url;
        switch (entityType) {
            case 'client':
                const clientDoc = await this.clientFileRepo.findClientFileDocumentById(tenantId, fileId);
                url = clientDoc?.url;
                break;
            case 'quote':
                const quoteFile = await this.quoteFileRepo.findQuoteFileById(tenantId, fileId);
                url = quoteFile?.url;
                break;
            case 'contract':
                const contractFile = await this.contractFileRepo.findContractFileById(tenantId, fileId);
                url = contractFile?.url;
                break;
            case 'agreement':
                const agreementFile = await this.agreementFileRepo.findAgreementFileById(tenantId, fileId);
                url = agreementFile?.url;
                break;
            case 'financial':
                const financialFile = await this.financialFileRepo.findFinancialFileById(tenantId, fileId);
                url = financialFile?.url;
                break;
            default:
                throw new common_1.NotFoundException('Unsupported entity type');
        }
        if (!url) {
            throw new common_1.NotFoundException('Document not found');
        }
        return { url };
    }
};
exports.DocumentViewerService = DocumentViewerService;
exports.DocumentViewerService = DocumentViewerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_file_repository_1.ClientFileRepository,
        quote_file_repository_1.QuoteFileRepository,
        contract_file_repository_1.ContractFileRepository,
        agreement_file_repository_1.AgreementFileRepository,
        financial_file_repository_1.FinancialFileRepository])
], DocumentViewerService);
//# sourceMappingURL=document-viewer.service.js.map