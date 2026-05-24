import { Injectable, BadRequestException } from '@nestjs/common';
import { SnapshotsRepository } from './snapshots.repository';
import * as crypto from 'crypto';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { tenantContext } from '../prisma/tenant-context';

export interface CreateSnapshotDto {
  entityType: string;
  payload: any;
}

@Injectable()
export class SnapshotsService {
  constructor(
    private readonly repo: SnapshotsRepository,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async createSnapshot(dto: CreateSnapshotDto) {
    const ctx = tenantContext.getStore();
    if (!ctx || !ctx.tenantId) {
      throw new BadRequestException('Tenant context is missing for Snapshot Creation');
    }

    // Hash the payload for immutability check
    const payloadString = JSON.stringify(dto.payload);
    const payloadHash = crypto.createHash('sha256').update(payloadString).digest('hex');

    // Get last version to increment
    const lastSnapshot = await this.repo.findLatestByType(dto.entityType, ctx.tenantId);
    const newVersion = lastSnapshot ? lastSnapshot.version + 1 : 1;
    const previousHash = lastSnapshot ? lastSnapshot.chainHash : 'GENESIS';
    const chainHash = crypto.createHash('sha256').update(previousHash + payloadHash).digest('hex');

    let snapshot;
    try {
      snapshot = await this.repo.create({
        tenantId: ctx.tenantId,
        entityType: dto.entityType,
        payloadHash,
        previousHash,
        chainHash,
        version: newVersion,
        payload: dto.payload,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Snapshot Hash Chain Collision detected. Please retry.');
      }
      throw error;
    }

    await this.eventPublisher.publish({
      eventName: 'snapshot.created',
      tenantId: ctx.tenantId,
      payload: { snapshotId: snapshot.id, entityType: snapshot.entityType, version: snapshot.version },
      timestamp: new Date()
    });

    return snapshot;
  }
}
