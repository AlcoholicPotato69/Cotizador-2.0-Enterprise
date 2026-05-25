import { PrismaService } from '../prisma/prisma.service';
import { ContractsRepository } from './contracts.repository';
import { ContractStatus } from '@prisma/client';
import { FsmValidator } from '../common/fsm.validator';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
export interface CreateContractDto {
    clientId: string;
    quoteId: string;
    currencyCode: string;
}
export declare class ContractEngineService {
    private readonly prisma;
    private readonly contractsRepo;
    private readonly fsmValidator;
    private readonly eventPublisher;
    constructor(prisma: PrismaService, contractsRepo: ContractsRepository, fsmValidator: FsmValidator, eventPublisher: DomainEventPublisher);
    createContract(dto: CreateContractDto): Promise<string>;
    updateContractStatus(contractId: string, newStatus: ContractStatus): Promise<void>;
    getContract(contractId: string): Promise<any>;
}
