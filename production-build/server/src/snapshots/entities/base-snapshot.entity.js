"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractSnapshot = exports.QuoteSnapshot = exports.CatalogSnapshot = exports.SpaceSnapshot = exports.BaseSnapshot = void 0;
class BaseSnapshot {
    id;
    tenantId;
    entityId;
    entityType;
    version;
    payload;
    createdAt;
    createdBy;
}
exports.BaseSnapshot = BaseSnapshot;
class SpaceSnapshot extends BaseSnapshot {
    constructor(partial) {
        super();
        Object.assign(this, partial);
        this.entityType = 'SPACE';
    }
}
exports.SpaceSnapshot = SpaceSnapshot;
class CatalogSnapshot extends BaseSnapshot {
    constructor(partial) {
        super();
        Object.assign(this, partial);
        this.entityType = 'CATALOG';
    }
}
exports.CatalogSnapshot = CatalogSnapshot;
class QuoteSnapshot extends BaseSnapshot {
    constructor(partial) {
        super();
        Object.assign(this, partial);
        this.entityType = 'QUOTE';
    }
}
exports.QuoteSnapshot = QuoteSnapshot;
class ContractSnapshot extends BaseSnapshot {
    constructor(partial) {
        super();
        Object.assign(this, partial);
        this.entityType = 'CONTRACT';
    }
}
exports.ContractSnapshot = ContractSnapshot;
//# sourceMappingURL=base-snapshot.entity.js.map