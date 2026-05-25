import { RegulationsService } from './regulations.service';
import { CreateRegulationDto, AcceptRegulationDto } from './dto/create-regulation.dto';
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
export declare class RegulationsController {
    private readonly service;
    constructor(service: RegulationsService);
    createRegulation(req: AuthenticatedRequest, dto: CreateRegulationDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        title: string;
    }>;
    acceptRegulation(req: AuthenticatedRequest, dto: AcceptRegulationDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        version: string;
        regulationId: string;
        ipAddress: string;
        userAgent: string | null;
        acceptedBy: string;
        acceptedAt: Date;
    }>;
}
export {};
