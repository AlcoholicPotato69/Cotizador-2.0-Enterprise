export declare class CatalogItemCreatedEvent {
    readonly tenantId: string;
    readonly itemId: string;
    readonly sku: string;
    readonly timestamp: Date;
    constructor(tenantId: string, itemId: string, sku: string, timestamp?: Date);
}
export declare class CatalogSnapshotCreatedEvent {
    readonly tenantId: string;
    readonly snapshotId: string;
    readonly timestamp: Date;
    constructor(tenantId: string, snapshotId: string, timestamp?: Date);
}
