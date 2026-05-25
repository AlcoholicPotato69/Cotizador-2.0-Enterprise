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
exports.InvoicesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvoicesRepository = class InvoicesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tx, data) {
        return tx.invoice.create({ data });
    }
    async findByIdForUpdate(tx, tenantId, id) {
        const result = await tx.$queryRaw `
      SELECT 
        id, 
        tenant_id AS "tenantId", 
        contract_snapshot_id AS "contractSnapshotId", 
        currency_code AS "currencyCode", 
        total_amount AS "totalAmount", 
        amount_paid AS "amountPaid", 
        balance_due AS "balanceDue", 
        payment_status AS "paymentStatus", 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM "Invoice"
      WHERE id = ${id}::uuid
      AND tenant_id = ${tenantId}::uuid
      FOR UPDATE
    `;
        if (!result || result.length === 0) {
            throw new common_1.NotFoundException('Invoice not found or access denied');
        }
        return result[0];
    }
    async findById(tx, tenantId, id) {
        return tx.invoice.findFirst({
            where: { id, tenantId }
        });
    }
    async update(tx, tenantId, id, data) {
        await tx.invoice.updateMany({
            where: { id, tenantId },
            data,
        });
        return this.findById(tx, tenantId, id);
    }
};
exports.InvoicesRepository = InvoicesRepository;
exports.InvoicesRepository = InvoicesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesRepository);
//# sourceMappingURL=invoices.repository.js.map