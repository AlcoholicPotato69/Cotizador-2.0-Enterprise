export declare abstract class BaseSnapshot {
    id: string;
    tenantId: string;
    entityId: string;
    entityType: string;
    version: number;
    payload: any;
    createdAt: Date;
    createdBy: string;
}
export declare class SpaceSnapshot extends BaseSnapshot {
    constructor(partial: Partial<SpaceSnapshot>);
}
export declare class CatalogSnapshot extends BaseSnapshot {
    constructor(partial: Partial<CatalogSnapshot>);
}
export declare class QuoteSnapshot extends BaseSnapshot {
    constructor(partial: Partial<QuoteSnapshot>);
}
export declare class ContractSnapshot extends BaseSnapshot {
    constructor(partial: Partial<ContractSnapshot>);
}
