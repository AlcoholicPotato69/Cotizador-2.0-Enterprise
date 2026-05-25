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
exports.PaymentEvidencesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentEvidencesRepository = class PaymentEvidencesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tx, data) {
        return tx.paymentEvidence.create({ data });
    }
    async findLatest(tx, tenantId) {
        const hashStr = tenantId.replace(/-/g, '').substring(0, 16);
        const lockId = BigInt('0x' + hashStr) % BigInt('9223372036854775807');
        await tx.$executeRaw `SELECT pg_advisory_xact_lock(${lockId})`;
        const result = await tx.$queryRaw `
      SELECT * FROM "PaymentEvidence"
      WHERE tenant_id = ${tenantId}::uuid
      ORDER BY created_at DESC
      LIMIT 1
    `;
        if (!result || result.length === 0) {
            return null;
        }
        return result[0];
    }
};
exports.PaymentEvidencesRepository = PaymentEvidencesRepository;
exports.PaymentEvidencesRepository = PaymentEvidencesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentEvidencesRepository);
//# sourceMappingURL=payment-evidences.repository.js.map