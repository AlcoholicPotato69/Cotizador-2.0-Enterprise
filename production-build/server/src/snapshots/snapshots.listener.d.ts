import { SnapshotsService } from './snapshots.service';
export declare class SnapshotsListener {
    private readonly snapshotsService;
    private readonly logger;
    constructor(snapshotsService: SnapshotsService);
    handleDomainEventsForSnapshots(event: any): Promise<void>;
}
