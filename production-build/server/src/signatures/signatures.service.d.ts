import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SignaturesRepository } from './signatures.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { Signature } from '@prisma/client';
import { SignContractDto } from './dto/sign-contract.dto';
export declare class SignaturesService {
    private readonly prisma;
    private readonly configService;
    private readonly signaturesRepo;
    private readonly eventPublisher;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService, signaturesRepo: SignaturesRepository, eventPublisher: DomainEventPublisher);
    getSignature(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deletedBy: string | null;
        contractId: string;
        participantName: string;
        participantRole: string;
        signatureHash: string;
        ipAddress: string | null;
        signedAt: Date;
    }>;
    signContract(dto: SignContractDto): Promise<Signature>;
    private signWithDocuSign;
    private signInternal;
}
