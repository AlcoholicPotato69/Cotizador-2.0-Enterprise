"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogSnapshotCreatedEvent = exports.CatalogItemCreatedEvent = void 0;
class CatalogItemCreatedEvent {
    tenantId;
    itemId;
    sku;
    timestamp;
    constructor(tenantId, itemId, sku, timestamp = new Date()) {
        this.tenantId = tenantId;
        this.itemId = itemId;
        this.sku = sku;
        this.timestamp = timestamp;
    }
}
exports.CatalogItemCreatedEvent = CatalogItemCreatedEvent;
class CatalogSnapshotCreatedEvent {
    tenantId;
    snapshotId;
    timestamp;
    constructor(tenantId, snapshotId, timestamp = new Date()) {
        this.tenantId = tenantId;
        this.snapshotId = snapshotId;
        this.timestamp = timestamp;
    }
}
exports.CatalogSnapshotCreatedEvent = CatalogSnapshotCreatedEvent;
//# sourceMappingURL=catalog.events.js.map