import { EventEmitter2 } from '@nestjs/event-emitter';
import { AgreementFileRepository } from './agreement-file.repository';
import { CreateAgreementFileDto } from './agreement-file.dto';
export declare class AgreementFileCreatedEvent {
    readonly tenantId: string;
    readonly fileId: string;
    readonly agreementId: string;
    constructor(tenantId: string, fileId: string, agreementId: string);
}
export declare class AgreementFileService {
    private readonly repository;
    private readonly eventEmitter;
    constructor(repository: AgreementFileRepository, eventEmitter: EventEmitter2);
    createAgreementFile(tenantId: string, dto: CreateAgreementFileDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        url: string;
        agreementId: string;
    }>;
    getAgreementFiles(tenantId: string, agreementId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        url: string;
        agreementId: string;
    }[]>;
}
