import { PrismaService } from '../../prisma/prisma.service';
import { ExpirationEngineService } from '../../compliance/expiration.service';
export declare class SchedulerService {
    private readonly prisma;
    private readonly expirationEngine;
    private readonly logger;
    constructor(prisma: PrismaService, expirationEngine: ExpirationEngineService);
    executeNightlySweeps(): Promise<void>;
}
