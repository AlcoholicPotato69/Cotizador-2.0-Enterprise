import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ClientFile, ClientFileDocument } from '@prisma/client';

@Injectable()
export class ClientFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClientFile(
    data: Prisma.ClientFileUncheckedCreateInput,
  ): Promise<ClientFile> {
    return this.prisma.clientFile.create({ data });
  }

  async findClientFiles(
    tenantId: string,
    clientId: string,
  ): Promise<ClientFile[]> {
    return this.prisma.clientFile.findMany({
      where: { tenantId, clientId, deletedAt: null },
      include: { documents: true },
    });
  }

  async findClientFileById(
    tenantId: string,
    id: string,
  ): Promise<ClientFile | null> {
    return this.prisma.clientFile.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { documents: true },
    });
  }

  async addDocument(
    data: Prisma.ClientFileDocumentUncheckedCreateInput,
  ): Promise<ClientFileDocument> {
    return this.prisma.clientFileDocument.create({ data });
  }

  async findClientFileDocumentById(
    tenantId: string,
    id: string,
  ): Promise<ClientFileDocument | null> {
    return this.prisma.clientFileDocument.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }
}
