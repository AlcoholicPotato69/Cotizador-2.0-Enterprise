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
var TamperDetectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TamperDetectionService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../prisma/prisma.service");
const domain_event_publisher_1 = require("../common/events/domain-event-publisher");
let TamperDetectionService = TamperDetectionService_1 = class TamperDetectionService {
    prisma;
    eventBus;
    logger = new common_1.Logger(TamperDetectionService_1.name);
    constructor(prisma, eventBus) {
        this.prisma = prisma;
        this.eventBus = eventBus;
    }
    async verifyAuditChain() {
        this.logger.log('Iniciando verificación criptográfica de la cadena de auditoría (Scheduled Job)...');
        const tenants = await this.prisma.tenant.findMany();
        const verificationResults = [];
        for (const tenant of tenants) {
            try {
                const logs = await this.prisma.auditLog.findMany({
                    where: { tenantId: tenant.id },
                    orderBy: { createdAt: 'asc' },
                });
                let previousHash = 'GENESIS';
                let tenantValid = true;
                for (const log of logs) {
                    const payloadString = JSON.stringify(log.payload);
                    const expectedCurrentHash = crypto
                        .createHash('sha256')
                        .update(`${log.action}|${payloadString}`)
                        .digest('hex');
                    const expectedChainHash = crypto
                        .createHash('sha256')
                        .update(previousHash + expectedCurrentHash)
                        .digest('hex');
                    if (log.currentHash !== expectedCurrentHash ||
                        log.chainHash !== expectedChainHash) {
                        this.logger.error(`¡CORRUPCIÓN DETECTADA en Tenant ${tenant.id}! AuditLog ID: ${log.id}`);
                        await this.eventBus.publish({
                            eventName: 'SYSTEM_TAMPERED',
                            tenantId: tenant.id,
                            payload: { logId: log.id, issue: 'AUDIT_CHAIN_BROKEN' },
                            timestamp: new Date(),
                        });
                        tenantValid = false;
                        break;
                    }
                    previousHash = log.chainHash;
                }
                verificationResults.push(tenantValid);
            }
            catch (err) {
                this.logger.error(`Error procesando tenant ${tenant.id}`, err);
                verificationResults.push(false);
            }
        }
        if (verificationResults.includes(false)) {
            this.logger.error('Validación finalizada con errores de integridad en algunos tenants.');
            return false;
        }
        this.logger.log('Cadena de auditoría validada exitosamente. Sin alteraciones.');
        return true;
    }
};
exports.TamperDetectionService = TamperDetectionService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TamperDetectionService.prototype, "verifyAuditChain", null);
exports.TamperDetectionService = TamperDetectionService = TamperDetectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        domain_event_publisher_1.DomainEventPublisher])
], TamperDetectionService);
//# sourceMappingURL=tamper-detection.service.js.map