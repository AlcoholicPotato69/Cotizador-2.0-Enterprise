import { StorageService } from './storage.service';
export declare class StorageController {
    private readonly service;
    constructor(service: StorageService);
    getStorageObject(id: string, user: any): Promise<{
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
}
