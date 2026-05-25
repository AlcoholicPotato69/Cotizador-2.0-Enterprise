import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, AgreementFile } from '@prisma/client';

@Injectable()
export class AgreementFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAgreementFile(
    data: Prisma.AgreementFileUncheckedCreateInput,
  ): Promise<AgreementFile> {
    return this.prisma.agreementFile.create({ data });
  }

  async findAgreementFiles(
    tenantId: string,
    agreementId: string,
  ): Promise<AgreementFile[]> {
    return this.prisma.agreementFile.findMany({
      where: { tenantId, agreementId, deletedAt: null },
    });
  }

  async findAgreementFileById(
    tenantId: string,
    id: string,
  ): Promise<AgreementFile | null> {
    return this.prisma.agreementFile.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }
}
