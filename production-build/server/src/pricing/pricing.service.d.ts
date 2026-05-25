import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export interface PricingIntent {
    action: string;
    resourceId: string;
    quantity: string;
    requestedDiscountPct: string;
    spaceId?: string;
    hours?: string;
    basePrice: string;
}
export interface SealedPayload {
    baseTotal: Prisma.Decimal;
    discountPct: Prisma.Decimal;
    discountAmount: Prisma.Decimal;
    subtotal: Prisma.Decimal;
    taxRate: Prisma.Decimal;
    taxAmount: Prisma.Decimal;
    grandTotal: Prisma.Decimal;
    currencyCode: string;
    isDiscountApproved: boolean;
    signature: string;
}
export declare class PricingEngineService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    evaluatePricing(intent: PricingIntent, userRole: string): Promise<SealedPayload>;
    private getMaxDiscountForRole;
    private generateSignature;
}
