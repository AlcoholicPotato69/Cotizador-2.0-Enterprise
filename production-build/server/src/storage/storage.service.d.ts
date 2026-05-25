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
export declare class StorageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    registerMetadata(dto: RegisterMetadataDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        bucketName: string;
        objectKey: string;
        fileSize: bigint;
        contentType: string;
        storageClass: string | null;
        checksum: string | null;
    }>;
    getMetadata(id: string, tenantId: string): Promise<{
        fileSize: number;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        bucketName: string;
        objectKey: string;
        contentType: string;
        storageClass: string | null;
        checksum: string | null;
    }>;
    getStorageInfo(id: string): Promise<{
        id: string;
        provider: string;
        size: number;
    }>;
}
