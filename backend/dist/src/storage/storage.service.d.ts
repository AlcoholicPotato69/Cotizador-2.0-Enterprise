export declare class StorageService {
    uploadFile(tenantId: string, fileBuffer: Buffer, fileName: string): Promise<string>;
    getFileUrl(tenantId: string, path: string): Promise<string>;
    deleteFile(tenantId: string, path: string): Promise<void>;
}
