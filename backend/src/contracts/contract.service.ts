import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractsRepository } from './contracts.repository';
import { DocumentsRepository } from '../documents/documents.repository';
import { SignaturesRepository } from '../signatures/signatures.repository';
import { ContractStatus, QuoteStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { tenantContext } from '../prisma/tenant-context';
import { FsmValidator } from '../common/fsm.validator';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';

export interface SignatureIntent {
  contractId: string;
  participantName: string;
  participantRole: string;
  ipAddress?: string;
  signatureData: string;
}

export interface CreateContractDto {
  quoteId: string;
  currencyCode: string;
}

@Injectable()
export class ContractEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractsRepo: ContractsRepository,
    private readonly documentsRepo: DocumentsRepository,
    private readonly signaturesRepo: SignaturesRepository,
    private readonly fsmValidator: FsmValidator,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async createContract(dto: CreateContractDto): Promise<string> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      // 3. Generate initial Contract document
      const templateVersion = 'v1.0';
      const templateHash = crypto.createHash('sha256').update(templateVersion).digest('hex');

      const contract = await this.contractsRepo.create(tx, {
        tenantId: ctx.tenantId,
        quoteSnapshotId: dto.quoteId,
        currencyCode: dto.currencyCode,
        templateVersion,
        templateHash,
        status: ContractStatus.DRAFT,
      });

      // 4. Create Evidence Hash Chain
      const contractPayloadString = `contract|${contract.id}|${contract.status}`;
      const currentHash = crypto.createHash('sha256').update(contractPayloadString).digest('hex');

      const lastDoc = await this.documentsRepo.findLatest(tx, ctx.tenantId);
      const previousHash = lastDoc ? lastDoc.chainHash : 'GENESIS';
      const chainHash = crypto.createHash('sha256').update(previousHash + currentHash).digest('hex');

      try {
        await this.documentsRepo.create(tx, {
          tenantId: ctx.tenantId,
          currentHash,
          previousHash,
          chainHash,
          legalHold: true,
        });
      } catch (error: any) {
        if (error.code === 'P2002') throw new ConflictException('Hash Chain Collision detected.');
        throw error;
      }

      await this.eventPublisher.publish({
        eventName: 'contract.generated',
        tenantId: ctx.tenantId,
        payload: { contractId: contract.id, quoteId: dto.quoteId },
        timestamp: new Date()
      });

      return contract.id;
    });
  }

  async registerSignature(intent: SignatureIntent): Promise<string> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) throw new ConflictException('Tenant context required');

    return await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      // Pessimistic lock on Contract
      const contract = await this.contractsRepo.findByIdForUpdate(tx, ctx.tenantId, intent.contractId);

      // Get count of signatures using repository
      const signaturesCount = await this.signaturesRepo.countByContract(tx, ctx.tenantId, contract.id);

      const currentSignatures = signaturesCount + 1;
      let newStatus: ContractStatus = ContractStatus.PENDING_SIGNATURE;
      if (currentSignatures >= 2) newStatus = ContractStatus.SIGNED;

      // FSM Validation
      this.fsmValidator.validateSignatureEligibility(contract.status);
      
      if (contract.status !== newStatus) {
        this.fsmValidator.validateTransition('Contract', contract.status, newStatus);
      }

      const signaturePayload = `${intent.participantName}|${intent.participantRole}|${intent.signatureData}|${intent.ipAddress || 'unknown'}`;
      const signatureHash = crypto.createHash('sha256').update(signaturePayload).digest('hex');

      const signature = await this.signaturesRepo.create(tx, {
        tenantId: ctx.tenantId,
        contractId: contract.id,
        participantName: intent.participantName,
        participantRole: intent.participantRole,
        signatureHash,
        ipAddress: intent.ipAddress,
      });

      await this.contractsRepo.update(tx, ctx.tenantId, contract.id, { status: newStatus });

      // Evidence Hash Chain
      const docPayloadString = `signature|${signature.id}|${signatureHash}`;
      const currentHash = crypto.createHash('sha256').update(docPayloadString).digest('hex');

      const lastDoc = await this.documentsRepo.findLatest(tx, ctx.tenantId);
      const previousHash = lastDoc ? lastDoc.chainHash : 'GENESIS';
      const chainHash = crypto.createHash('sha256').update(previousHash + currentHash).digest('hex');

      try {
        await this.documentsRepo.create(tx, {
          tenantId: ctx.tenantId,
          currentHash,
          previousHash,
          chainHash,
          legalHold: true,
        });
      } catch (error: any) {
        if (error.code === 'P2002') throw new ConflictException('Hash Chain Collision detected during signature.');
        throw error;
      }

      await this.eventPublisher.publish({
        eventName: 'contract.signed',
        tenantId: ctx.tenantId,
        payload: { contractId: contract.id, signatureId: signature.id, status: newStatus },
        timestamp: new Date()
      });

      return signature.id;
    });
  }
}

