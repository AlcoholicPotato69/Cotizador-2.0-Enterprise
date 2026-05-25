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
exports.PricingEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let PricingEngineService = class PricingEngineService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async evaluatePricing(intent, userRole) {
        const client = this.prisma;
        let basePrice = new client_1.Prisma.Decimal(intent.basePrice);
        if (intent.action === 'RESERVE_SPACE' && intent.hours) {
            const hours = new client_1.Prisma.Decimal(intent.hours);
            basePrice = basePrice.mul(hours);
        }
        const baseTotal = basePrice.mul(new client_1.Prisma.Decimal(intent.quantity));
        const requestedDiscount = new client_1.Prisma.Decimal(intent.requestedDiscountPct || '0');
        const maxAllowedDiscount = this.getMaxDiscountForRole(userRole);
        if (requestedDiscount.greaterThan(maxAllowedDiscount)) {
            throw new common_1.BadRequestException(`Discount of ${requestedDiscount.toString()}% exceeds allowed maximum of ${maxAllowedDiscount.toString()}% for role ${userRole}. Requires approval workflow.`);
        }
        const discountPct = requestedDiscount.div(100);
        const discountAmount = baseTotal.mul(discountPct);
        const subtotal = baseTotal.sub(discountAmount);
        const taxConfig = await client.taxConfiguration.findFirst({
            where: { isDefault: true },
        });
        const taxRate = taxConfig ? taxConfig.taxRate : new client_1.Prisma.Decimal(0);
        const taxAmount = subtotal.mul(taxRate);
        const grandTotal = subtotal.add(taxAmount);
        const payload = {
            baseTotal,
            discountPct: requestedDiscount,
            discountAmount,
            subtotal,
            taxRate,
            taxAmount,
            grandTotal,
            currencyCode: 'USD',
            isDiscountApproved: true,
            signature: '',
        };
        payload.signature = this.generateSignature(payload);
        return payload;
    }
    getMaxDiscountForRole(role) {
        const configMax = process.env[`MAX_DISCOUNT_${role}`];
        if (configMax) {
            return new client_1.Prisma.Decimal(configMax);
        }
        throw new common_1.BadRequestException(`No discount policy configured for role ${role}`);
    }
    generateSignature(payload) {
        const secret = process.env.SEAL_SECRET;
        if (!secret)
            throw new Error('SEAL_SECRET is not configured');
        const positionalString = [
            payload.baseTotal?.toString(),
            payload.discountPct?.toString(),
            payload.discountAmount?.toString(),
            payload.subtotal?.toString(),
            payload.taxRate?.toString(),
            payload.taxAmount?.toString(),
            payload.grandTotal?.toString(),
            payload.currencyCode,
            payload.isDiscountApproved?.toString()
        ].join('|');
        return crypto.createHmac('sha256', secret).update(positionalString).digest('hex');
    }
};
exports.PricingEngineService = PricingEngineService;
exports.PricingEngineService = PricingEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricingEngineService);
//# sourceMappingURL=pricing.service.js.map