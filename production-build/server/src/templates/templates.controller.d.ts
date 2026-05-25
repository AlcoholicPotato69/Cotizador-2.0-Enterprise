import { TemplatesService } from './templates.service';
import { CreateTemplateDto, CreateClauseDto } from './dto/create-template.dto';
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
export declare class TemplatesController {
    private readonly service;
    constructor(service: TemplatesService);
    createTemplate(req: AuthenticatedRequest, dto: CreateTemplateDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        name: string;
    }>;
    createClause(req: AuthenticatedRequest, dto: CreateClauseDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        title: string;
    }>;
}
export {};
