import { PrismaService } from '../prisma/prisma.service';
export declare class GlobalSearchEngineService {
    private prisma;
    constructor(prisma: PrismaService);
    globalSearch(query: string, tenantId: string): Promise<unknown>;
}
