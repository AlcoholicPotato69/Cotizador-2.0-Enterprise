import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RegisterMetadataDto {
  tenantId: string;
  bucketName: string;
  objectKey: string;
  fileSize: number;
  contentType: string;
  storageClass?: string;
  checksum?: string;
}

@Injectable()
export class StorageService {
  constructor(private readonly prisma: PrismaService) {}

  async registerMetadata(dto: RegisterMetadataDto) {
    return this.prisma.storageMetadata.create({
      data: {
        tenantId: dto.tenantId,
        bucketName: dto.bucketName,
        objectKey: dto.objectKey,
        fileSize: BigInt(dto.fileSize),
        contentType: dto.contentType,
        storageClass: dto.storageClass,
        checksum: dto.checksum,
      },
    });
  }

  async getMetadata(id: string, tenantId: string) {
    const metadata = await this.prisma.storageMetadata.findUnique({
      where: {
        id,
      },
    });
    if (!metadata || metadata.tenantId !== tenantId) {
      throw new NotFoundException(`Storage metadata ${id} not found`);
    }
    return {
      ...metadata,
      fileSize: Number(metadata.fileSize),
    };
  }

  async getStorageInfo(id: string) {
    return { id, provider: 'S3', size: 0 };
  }
}
