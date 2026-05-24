import { Injectable, ConflictException } from '@nestjs/common';
import { AuditRepository } from './audit.repository';
import * as crypto from 'crypto';

export interface CreateAuditLogDto {
  tenantId: string;
  action: string;
  payload: any;
}

@Injectable()
export class AuditService {
  constructor(private readonly repo: AuditRepository) {}

  async logEvent(dto: CreateAuditLogDto) {
    const payloadString = JSON.stringify(dto.payload);
    const currentHash = crypto.createHash('sha256').update(`${dto.action}|${payloadString}`).digest('hex');

    const lastLog = await this.repo.findLatest(dto.tenantId);
    const previousHash = lastLog ? lastLog.chainHash : 'GENESIS';
    const chainHash = crypto.createHash('sha256').update(previousHash + currentHash).digest('hex');

    try {
      await this.repo.create({
        tenantId: dto.tenantId,
        action: dto.action,
        payload: dto.payload,
        currentHash,
        previousHash,
        chainHash,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        // En un entorno asíncrono real, esto podría encolarse o reintentarse.
        // Por simplicidad, arrojamos conflicto.
        throw new ConflictException('Audit Hash Chain Collision detected.');
      }
      throw error;
    }
  }
}
