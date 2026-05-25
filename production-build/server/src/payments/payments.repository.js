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
exports.PaymentsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsRepository = class PaymentsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tx, data) {
        return tx.payment.create({ data });
    }
    async findByIdForUpdate(tx, tenantId, id) {
        const result = await tx.$queryRaw `
      SELECT * FROM "Payment"
      WHERE id = ${id}::uuid
      AND tenant_id = ${tenantId}::uuid
      FOR UPDATE
    `;
        if (!result || result.length === 0) {
            throw new common_1.NotFoundException('Payment not found or access denied');
        }
        return result[0];
    }
    async findById(tx, tenantId, id) {
        return tx.payment.findFirst({
            where: { id, tenantId }
        });
    }
    async update(tx, tenantId, id, data) {
        await tx.payment.updateMany({
            where: { id, tenantId },
            data,
        });
        return this.findById(tx, tenantId, id);
    }
};
exports.PaymentsRepository = PaymentsRepository;
exports.PaymentsRepository = PaymentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsRepository);
//# sourceMappingURL=payments.repository.js.map