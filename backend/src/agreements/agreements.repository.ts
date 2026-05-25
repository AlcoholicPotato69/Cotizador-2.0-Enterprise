import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AgreementsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AgreementUncheckedCreateInput) {
    return this.prisma.agreement.create({ data });
  }

  async findManyByTenant(
    tenantId: string,
    filters?: { clientId?: string; status?: string; type?: string },
  ) {
    return this.prisma.agreement.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(filters?.clientId && { clientId: filters.clientId }),
        ...(filters?.status && { status: filters.status as any }),
        ...(filters?.type && { type: filters.type as any }),
      },
      include: {
        items: true,
        versions: { orderBy: { versionNumber: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    const agreement = await this.prisma.agreement.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        items: true,
        versions: { orderBy: { versionNumber: 'desc' } },
        approvals: { orderBy: { createdAt: 'desc' } },
        signatures: true,
        evidences: true,
        snapshots: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!agreement) {
      throw new NotFoundException(
        `Agreement ${id} not found in tenant ${tenantId}`,
      );
    }
    return agreement;
  }

  async update(
    tenantId: string,
    id: string,
    data: Prisma.AgreementUncheckedUpdateInput,
  ) {
    return this.prisma.agreement.update({
      where: { id, tenantId },
      data,
    });
  }

  async addItems(
    tenantId: string,
    agreementId: string,
    items: { description: string }[],
  ) {
    return this.prisma.agreementItem.createMany({
      data: items.map((item) => ({
        tenantId,
        agreementId,
        description: item.description,
      })),
    });
  }

  async createVersion(data: Prisma.AgreementVersionUncheckedCreateInput) {
    return this.prisma.agreementVersion.create({ data });
  }

  async getLatestVersion(tenantId: string, agreementId: string) {
    return this.prisma.agreementVersion.findFirst({
      where: { tenantId, agreementId },
      orderBy: { versionNumber: 'desc' },
    });
  }

  async createApproval(data: Prisma.AgreementApprovalUncheckedCreateInput) {
    return this.prisma.agreementApproval.create({ data });
  }

  async createSignature(data: Prisma.AgreementSignatureUncheckedCreateInput) {
    return this.prisma.agreementSignature.create({ data });
  }

  async createEvidence(data: Prisma.AgreementEvidenceUncheckedCreateInput) {
    return this.prisma.agreementEvidence.create({ data });
  }

  async createSnapshot(data: Prisma.AgreementSnapshotUncheckedCreateInput) {
    return this.prisma.agreementSnapshot.create({ data });
  }
}
