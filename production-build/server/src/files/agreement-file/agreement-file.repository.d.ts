import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, AgreementFile } from '@prisma/client';
export declare class AgreementFileRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createAgreementFile(data: Prisma.AgreementFileUncheckedCreateInput): Promise<AgreementFile>;
    findAgreementFiles(tenantId: string, agreementId: string): Promise<AgreementFile[]>;
    findAgreementFileById(tenantId: string, id: string): Promise<AgreementFile | null>;
}
