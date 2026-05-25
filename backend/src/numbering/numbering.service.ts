import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateFolioDto } from './dto/generate-folio.dto';

@Injectable()
export class NumberingService {
  constructor(private readonly prisma: PrismaService) {}

  async generateFolio(dto: GenerateFolioDto): Promise<string> {
    const { tenantId, entityType, prefix = '', suffix = '', step = 1 } = dto;

    const sequence = await this.prisma.numberingSequence.upsert({
      where: {
        tenantId_entityType: {
          tenantId,
          entityType,
        },
      },
      update: {
        currentValue: {
          increment: step,
        },
      },
      create: {
        tenantId,
        entityType,
        prefix,
        suffix,
        currentValue: step,
        step,
      },
    });

    const paddedValue = sequence.currentValue.toString().padStart(6, '0');
    const actualPrefix = sequence.prefix || prefix;
    const actualSuffix = sequence.suffix || suffix;

    let folio = paddedValue;
    if (actualPrefix) folio = `${actualPrefix}-${folio}`;
    if (actualSuffix) folio = `${folio}-${actualSuffix}`;

    return folio;
  }
}
