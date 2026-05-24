import { StorageService } from './storage.service';
import { TenantContextService } from '../common/tenant-context.service';
export declare class StorageController {
    private readonly storageService;
    private readonly tenantContext;
    constructor(storageService: StorageService, tenantContext: TenantContextService);
    upload(file: any, fileName: string): Promise<{
        url: string;
    }>;
    getUrl(path: string): Promise<{
        url: string;
    }>;
    delete(path: string): Promise<{
        success: boolean;
    }>;
}
