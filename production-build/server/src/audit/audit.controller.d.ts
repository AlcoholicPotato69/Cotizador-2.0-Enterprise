import { AuditService } from './audit.service';
import { AuditRepository } from './audit.repository';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        tenantId: string;
        role: string;
        email: string;
        permissions: string[];
    };
}
export declare class AuditController {
    private readonly auditService;
    private readonly auditRepo;
    constructor(auditService: AuditService, auditRepo: AuditRepository);
    findAll(req: AuthenticatedRequest): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        action: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        previousHash: string;
        currentHash: string;
        chainHash: string;
        correlationId: string | null;
        traceId: string | null;
    }[]>;
    findOne(req: AuthenticatedRequest, id: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        action: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        previousHash: string;
        currentHash: string;
        chainHash: string;
        correlationId: string | null;
        traceId: string | null;
    }>;
}
export {};
