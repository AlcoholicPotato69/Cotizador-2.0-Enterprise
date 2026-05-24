import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SnapshotsService } from './snapshots.service';
import { tenantContext } from '../prisma/tenant-context';

@Injectable()
export class SnapshotsListener {
  private readonly logger = new Logger(SnapshotsListener.name);

  constructor(private readonly snapshotsService: SnapshotsService) {}

  @OnEvent('*.created', { async: true })
  @OnEvent('*.updated', { async: true })
  @OnEvent('*.approved', { async: true })
  @OnEvent('*.generated', { async: true })
  async handleDomainEventsForSnapshots(event: any) {
    // Only process domain events that have tenantId and payload
    if (!event || !event.tenantId || !event.payload) return;

    // Use AsyncLocalStorage to set tenant context for the async background job
    tenantContext.run({ tenantId: event.tenantId, userId: 'SYSTEM', role: 'SYSTEM' }, async () => {
      try {
        const entityType = event.eventName ? event.eventName.split('.')[0] : 'Unknown';
        await this.snapshotsService.createSnapshot({
          entityType: entityType.toUpperCase(),
          payload: event.payload
        });
        this.logger.log(`Snapshot saved for event: ${event.eventName || 'unknown'}`);
      } catch (error) {
        this.logger.error(`Failed to save snapshot for event: ${event.eventName}`, error);
      }
    });
  }
}
