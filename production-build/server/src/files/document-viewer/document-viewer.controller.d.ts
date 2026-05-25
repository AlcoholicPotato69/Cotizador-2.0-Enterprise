import { DocumentViewerService } from './document-viewer.service';
import type { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        tenantId: string;
        role: string;
        email: string;
        permissions: string[];
    };
}
export declare class DocumentViewerController {
    private readonly service;
    constructor(service: DocumentViewerService);
    generateSignedUrl(req: AuthenticatedRequest, entityType: string, fileId: string, expiresInMinutes?: number): {
        url: string;
    };
    viewDocument(req: AuthenticatedRequest, tenantId: string, entityType: string, fileId: string, expiresAt: string, signature: string, res: any): Promise<any>;
}
export {};
