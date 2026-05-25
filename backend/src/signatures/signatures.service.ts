import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SignaturesRepository } from './signatures.repository';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';
import { SignatureMode } from '../config/env.validation';
import { Prisma, Signature } from '@prisma/client';
import { SignContractDto } from './dto/sign-contract.dto';

@Injectable()
export class SignaturesService {
  private readonly logger = new Logger(SignaturesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly signaturesRepo: SignaturesRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async getSignature(id: string, tenantId: string) {
    const signature = await this.prisma.signature.findUnique({
      where: { id },
    });
    if (!signature || signature.tenantId !== tenantId) {
      throw new ConflictException('Signature not found');
    }
    return signature;
  }

  async signContract(dto: SignContractDto): Promise<Signature> {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId)
      throw new ConflictException('Tenant context required');

    const mode =
      this.configService.get<SignatureMode>('SIGNATURE_MODE') ||
      SignatureMode.INTERNAL;

    return await this.prisma.$transaction(async (tx) => {
      // Set Postgres variables for RLS / Audit if any
      await tx.$executeRaw`
        SELECT 
          set_config('app.current_tenant_id', ${ctx.tenantId}, TRUE),
          set_config('app.current_user_id', ${ctx.userId || ''}, TRUE),
          set_config('app.current_role', ${ctx.role || ''}, TRUE)
      `;

      let signatureHash = '';

      if (mode === SignatureMode.DOCUSIGN) {
        try {
          const result = await this.signWithDocuSign(
            dto.contractId,
            dto.participantName,
          );
          signatureHash = result.hash;
        } catch (error) {
          this.logger.warn(
            `DocuSign failed for contract ${dto.contractId}, falling back to INTERNAL mode.`,
          );
          if (!dto.signatureData) {
            throw new ConflictException(
              'DocuSign API unavailable. Manual signature data required for fallback.',
            );
          }
          const result = this.signInternal(
            dto.contractId,
            dto.participantName,
            dto.signatureData,
          );
          signatureHash = result.hash;
        }
      } else {
        if (!dto.signatureData) {
          throw new ConflictException(
            'Signature data is required for internal mode.',
          );
        }
        const result = this.signInternal(
          dto.contractId,
          dto.participantName,
          dto.signatureData,
        );
        signatureHash = result.hash;
      }

      const signature = await this.signaturesRepo.create(tx, {
        tenantId: ctx.tenantId,
        contractId: dto.contractId,
        participantName: dto.participantName,
        participantRole: dto.participantRole,
        signatureHash: signatureHash,
        ipAddress: '127.0.0.1', // Mock IP or extract from context
        signedAt: new Date(),
      });

      await this.eventPublisher.publish({
        eventName: 'contract.signed',
        tenantId: ctx.tenantId,
        payload: { contractId: dto.contractId, signatureId: signature.id },
        timestamp: new Date(),
      });

      return signature;
    });
  }

  private async signWithDocuSign(
    contractId: string,
    participantName: string,
  ): Promise<{ hash: string }> {
    if (Math.random() > 0.5) {
      throw new Error('DocuSign API unavailable');
    }
    return {
      hash: `ds_hash_${Date.now()}`,
    };
  }

  private signInternal(
    contractId: string,
    participantName: string,
    signatureData: string,
  ): { hash: string } {
    return {
      hash: `internal_hash_${signatureData}_${Date.now()}`,
    };
  }
}
