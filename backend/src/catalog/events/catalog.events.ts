export class CatalogItemCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly itemId: string,
    public readonly sku: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class CatalogSnapshotCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly snapshotId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
