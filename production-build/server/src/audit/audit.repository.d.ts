import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AuditLog } from '@prisma/client';
export declare class AuditRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AuditLogCreateInput): Promise<AuditLog>;
    findLatest(tenantId: string): Promise<AuditLog | null>;
    findByTenantId(tenantId: string): Promise<AuditLog[]>;
    findByIdAndTenant(tenantId: string, id: string): Promise<AuditLog>;
}
