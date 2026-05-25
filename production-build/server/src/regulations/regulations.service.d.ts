import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateRegulationDto, AcceptRegulationDto } from './dto/create-regulation.dto';
export declare class RegulationsService {
    private readonly prisma;
    private readonly eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    createRegulation(dto: CreateRegulationDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        title: string;
    }>;
    acceptRegulation(dto: AcceptRegulationDto): Promise<{
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
