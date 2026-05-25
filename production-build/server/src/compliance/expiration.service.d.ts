import { Prisma } from '@prisma/client';
export declare class ExpirationEngineService {
    private readonly logger;
    scanExpirations(tx: Prisma.TransactionClient): Promise<void>;
}
