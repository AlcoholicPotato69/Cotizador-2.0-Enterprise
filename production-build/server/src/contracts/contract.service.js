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
exports.ContractEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const contracts_repository_1 = require("./contracts.repository");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
const tenant_context_1 = require("../prisma/tenant-context");
const fsm_validator_1 = require("../common/fsm.validator");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
let ContractEngineService = class ContractEngineService {
    prisma;
    contractsRepo;
    fsmValidator;
    eventPublisher;
    constructor(prisma, contractsRepo, fsmValidator, eventPublisher) {
        this.prisma = prisma;
        this.contractsRepo = contractsRepo;
        this.fsmValidator = fsmValidator;
        this.eventPublisher = eventPublisher;
    }
    async createContract(dto) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;
            const templateVersion = 'v1.0';
            const templateHash = crypto.createHash('sha256').update(templateVersion).digest('hex');
            const contract = await this.contractsRepo.create(tx, {
                tenantId: ctx.tenantId,
                clientId: dto.clientId,
                quoteSnapshotId: dto.quoteId,
                currencyCode: dto.currencyCode,
                templateVersion,
                templateHash,
                status: client_1.ContractStatus.DRAFT,
            });
            await this.eventPublisher.publish({
                eventName: 'contract.generated',
                tenantId: ctx.tenantId,
                payload: { contractId: contract.id, quoteId: dto.quoteId, status: contract.status },
                timestamp: new Date()
            });
            return contract.id;
        });
    }
    async updateContractStatus(contractId, newStatus) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;
            const contract = await this.contractsRepo.findByIdForUpdate(tx, ctx.tenantId, contractId);
            this.fsmValidator.validateTransition('Contract', contract.status, newStatus);
            await this.contractsRepo.update(tx, ctx.tenantId, contract.id, { status: newStatus });
            await this.eventPublisher.publish({
                eventName: 'contract.status_updated',
                tenantId: ctx.tenantId,
                payload: { contractId: contract.id, oldStatus: contract.status, newStatus },
                timestamp: new Date()
            });
        });
    }
    async getContract(contractId) {
        const ctx = tenant_context_1.tenantContext.getStore();
        if (!ctx || !ctx.tenantId)
            throw new common_1.ConflictException('Tenant context required');
        return await this.contractsRepo.findByIdForUpdate(this.prisma, ctx.tenantId, contractId);
    }
};
exports.ContractEngineService = ContractEngineService;
exports.ContractEngineService = ContractEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        contracts_repository_1.ContractsRepository,
        fsm_validator_1.FsmValidator,
        domain_event_publisher_1.DomainEventPublisher])
], ContractEngineService);
//# sourceMappingURL=contract.service.js.map