import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
// import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SnapshotsService {
  // constructor(private prisma: PrismaService) {}

  async createSnapshot(tenantId: string, entityType: string, entityId: string, payload: any): Promise<any> {
    const payloadString = JSON.stringify(payload);
    const snapshotHash = crypto.createHash('sha256').update(payloadString).digest('hex');

    /*
    // Versioning Strategy
    const lastSnapshot = await this.prisma.snapshot.findFirst({
      where: { tenantId, entityType, entityId },
      orderBy: { version: 'desc' }
    });

    if (lastSnapshot && lastSnapshot.snapshotHash === snapshotHash) {
      // Deduplicación: Si es idéntico, retornamos el último
      return lastSnapshot;
    }

    const version = lastSnapshot ? lastSnapshot.version + 1 : 1;

    return await this.prisma.snapshot.create({
      data: {
        tenantId,
        entityType,
        entityId,
        version,
        payload,
        snapshotHash
      }
    });
    */
    
    return {
      version: 1,
      snapshotHash,
      payload
    };
  }
}
