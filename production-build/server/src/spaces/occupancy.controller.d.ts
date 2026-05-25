import { OccupancyService } from './occupancy.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        tenantId: string;
        role: string;
        permissions: string[];
    };
}
export declare class OccupancyController {
    private readonly occupancyService;
    constructor(occupancyService: OccupancyService);
    create(req: AuthenticatedRequest, data: Omit<Prisma.SpaceOccupancyUncheckedCreateInput, 'tenantId'>): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        status: import(".prisma/client").$Enums.OccupancyStatus;
        correlationId: string | null;
        traceId: string | null;
        spaceId: string;
        occupancySourceType: string;
        occupancySourceId: string;
        startTime: Date;
        endTime: Date;
    }>;
}
export {};
