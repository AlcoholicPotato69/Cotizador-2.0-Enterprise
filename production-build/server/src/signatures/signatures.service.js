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
var SignaturesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignaturesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const signatures_repository_1 = require("./signatures.repository");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
const tenant_context_1 = require("../prisma/tenant-context");
const env_validation_1 = require("../config/env.validation");
let SignaturesService = SignaturesService_1 = class SignaturesService {
    prisma;
    configService;
    signaturesRepo;
    eventPublisher;
    logger = new common_1.Logger(SignaturesService_1.name);
    constructor(prisma, configService, signaturesRepo, eventPublisher) {
        this.prisma = prisma;
        this.configService = configService;
        this.signaturesRepo = signaturesRepo;
        this.eventPublisher = eventPublisher;
    }
    async getSignature(id, tenantId) {
        const signature = await this.prisma.signature.findUnique({
            where: { id }
        });
        if (!signature || signature.tenantId !== tenantId) {
            throw new common_1.ConflictException('Signature not found');
        }
        return signature;
    }
    async signContract(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        const mode = this.configService.get('SIGNATURE_MODE') || env_validation_1.SignatureMode.INTERNAL;
        return await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;
            let signatureHash = '';
            if (mode === env_validation_1.SignatureMode.DOCUSIGN) {
                try {
                    const result = await this.signWithDocuSign(dto.contractId, dto.participantName);
                    signatureHash = result.hash;
                }
                catch (error) {
                    this.logger.warn(`DocuSign failed for contract ${dto.contractId}, falling back to INTERNAL mode.`);
                    if (!dto.signatureData) {
                        throw new common_1.ConflictException('DocuSign API unavailable. Manual signature data required for fallback.');
                    }
                    const result = this.signInternal(dto.contractId, dto.participantName, dto.signatureData);
                    signatureHash = result.hash;
                }
            }
            else {
                if (!dto.signatureData) {
                    throw new common_1.ConflictException('Signature data is required for internal mode.');
                }
                const result = this.signInternal(dto.contractId, dto.participantName, dto.signatureData);
                signatureHash = result.hash;
            }
            const signature = await this.signaturesRepo.create(tx, {
                tenantId: ctx.tenantId,
                contractId: dto.contractId,
                participantName: dto.participantName,
                participantRole: dto.participantRole,
                signatureHash: signatureHash,
                ipAddress: '127.0.0.1',
                signedAt: new Date(),
            });
            await this.eventPublisher.publish({
                eventName: 'contract.signed',
                tenantId: ctx.tenantId,
                payload: { contractId: dto.contractId, signatureId: signature.id },
                timestamp: new Date()
            });
            return signature;
        });
    }
    async signWithDocuSign(contractId, participantName) {
        if (Math.random() > 0.5) {
            throw new Error('DocuSign API unavailable');
        }
        return {
            hash: `ds_hash_${Date.now()}`
        };
    }
    signInternal(contractId, participantName, signatureData) {
        return {
            hash: `internal_hash_${signatureData}_${Date.now()}`
        };
    }
};
exports.SignaturesService = SignaturesService;
exports.SignaturesService = SignaturesService = SignaturesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        signatures_repository_1.SignaturesRepository,
        domain_event_publisher_1.DomainEventPublisher])
], SignaturesService);
//# sourceMappingURL=signatures.service.js.map