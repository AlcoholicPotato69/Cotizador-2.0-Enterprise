import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
// using Prisma.Decimal directly
import * as crypto from 'crypto';

export interface PricingIntent {
  action: string;
  resourceId: string;
  quantity: string; // Strings para prevenir corrupción Float
  requestedDiscountPct: string; // Strings para prevenir corrupción Float
  spaceId?: string;
  hours?: string; // Strings
  basePrice: string; // Requerido: Pasado por el caller (Snapshot/Event) para evitar Live Reads
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

@Injectable()
export class PricingEngineService {
  constructor(private readonly prisma: PrismaService) {}

  async evaluatePricing(
    intent: PricingIntent,
    userRole: string,
  ): Promise<SealedPayload> {
    const client = this.prisma;

    // Zero Live Reads: Usar basePrice provisto en el intent, no leer de client.space ni client.catalogPrice
    let basePrice = new Prisma.Decimal(intent.basePrice);

    if (intent.action === 'RESERVE_SPACE' && intent.hours) {
      const hours = new Prisma.Decimal(intent.hours);
      basePrice = basePrice.mul(hours);
    }

    const baseTotal = basePrice.mul(new Prisma.Decimal(intent.quantity));

    const requestedDiscount = new Prisma.Decimal(
      intent.requestedDiscountPct || '0',
    );
    const maxAllowedDiscount = this.getMaxDiscountForRole(userRole);

    if (requestedDiscount.greaterThan(maxAllowedDiscount)) {
      throw new BadRequestException(
        `Discount of ${requestedDiscount.toString()}% exceeds allowed maximum of ${maxAllowedDiscount.toString()}% for role ${userRole}. Requires approval workflow.`,
      );
    }

    const discountPct = requestedDiscount.div(100);
    const discountAmount = baseTotal.mul(discountPct);
    const subtotal = baseTotal.sub(discountAmount);

    const taxConfig = await client.taxConfiguration.findFirst({
      where: { isDefault: true },
    });

    const taxRate = taxConfig ? taxConfig.taxRate : new Prisma.Decimal(0);
    const taxAmount = subtotal.mul(taxRate);
    const grandTotal = subtotal.add(taxAmount);

    const payload: SealedPayload = {
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

  private getMaxDiscountForRole(role: string): Prisma.Decimal {
    const configMax = process.env[`MAX_DISCOUNT_${role}`];
    if (configMax) {
      return new Prisma.Decimal(configMax);
    }
    throw new BadRequestException(
      `No discount policy configured for role ${role}`,
    );
  }

  private generateSignature(payload: Partial<SealedPayload>): string {
    const secret = process.env.SEAL_SECRET;
    if (!secret) throw new Error('SEAL_SECRET is not configured');

    // Esquema posicional concatenado determinista (evita corrupciones de JSON.stringify)
    // payload_string = baseTotal|discountPct|discountAmount|subtotal|taxRate|taxAmount|grandTotal|currencyCode|isDiscountApproved
    const positionalString = [
      payload.baseTotal?.toString(),
      payload.discountPct?.toString(),
      payload.discountAmount?.toString(),
      payload.subtotal?.toString(),
      payload.taxRate?.toString(),
      payload.taxAmount?.toString(),
      payload.grandTotal?.toString(),
      payload.currencyCode,
      payload.isDiscountApproved?.toString(),
    ].join('|');

    return crypto
      .createHmac('sha256', secret)
      .update(positionalString)
      .digest('hex');
  }
}
