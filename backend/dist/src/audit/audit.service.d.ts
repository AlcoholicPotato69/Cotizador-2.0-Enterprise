import { AuditRepository } from './audit.repository';
export interface CreateAuditLogDto {
    tenantId: string;
    action: string;
    payload: any;
}
export declare class AuditService {
    private readonly repo;
    constructor(repo: AuditRepository);
    logEvent(dto: CreateAuditLogDto): Promise<void>;
}
