import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractsRepository } from './contracts.repository';
import { ContractStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { tenantContext } from '../prisma/tenant-context';
import { FsmValidator } from '../common/fsm.validator';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';

export interface CreateContractDto {
  clientId: string;
  quoteId: string;
  currencyCode: string;
}

@Injectable()
export class ContractEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractsRepo: ContractsRepository,
    private readonly fsmValidator: FsmValidator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async createContract(dto: CreateContractDto): Promise<string> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      const templateVersion = 'v1.0';
      const templateHash = crypto
        .createHash('sha256')
        .update(templateVersion)
        .digest('hex');

      const contract = await this.contractsRepo.create(tx, {
        tenantId: ctx.tenantId,
        clientId: dto.clientId,
        quoteSnapshotId: dto.quoteId,
        currencyCode: dto.currencyCode,
        templateVersion,
        templateHash,
        status: ContractStatus.DRAFT,
      });

      // Emitting event instead of direct cross-domain injection to DocumentsModule
      await this.eventPublisher.publish({
        eventName: 'contract.generated',
        tenantId: ctx.tenantId,
        payload: {
          contractId: contract.id,
          quoteId: dto.quoteId,
          status: contract.status,
        },
        timestamp: new Date(),
      });

      return contract.id;
    });
  }

  async updateContractStatus(
    contractId: string,
    newStatus: ContractStatus,
  ): Promise<any> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE)
      `;

      const contract = await this.contractsRepo.findByIdForUpdate(
        tx,
        ctx.tenantId,
        contractId,
      );
      this.fsmValidator.validateTransition(
        'Contract',
        contract.status,
        newStatus,
      );

      const updated = await this.contractsRepo.update(
        tx,
        ctx.tenantId,
        contract.id,
        {
        status: newStatus,
      });

      await this.eventPublisher.publish({
        eventName: 'contract.status_updated',
        tenantId: ctx.tenantId,
        payload: {
          contractId: contract.id,
          oldStatus: contract.status,
          newStatus,
        },
        timestamp: new Date(),
      });

      return updated;
    });
  }

  async getContract(contractId: string): Promise<any> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');
    return await this.contractsRepo.findByIdForUpdate(
      this.prisma,
      ctx.tenantId,
      contractId,
    );
  }

  async findAll(): Promise<any[]> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');
    return await this.contractsRepo.findMany(ctx.tenantId);
  }
}
