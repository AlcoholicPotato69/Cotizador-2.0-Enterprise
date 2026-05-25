export abstract class BaseSnapshot {
  id: string;
  tenantId: string;
  entityId: string;
  entityType: string;
  version: number;
  payload: any;
  createdAt: Date;
  createdBy: string;
}

export class SpaceSnapshot extends BaseSnapshot {
  constructor(partial: Partial<SpaceSnapshot>) {
    super();
    Object.assign(this, partial);
    this.entityType = 'SPACE';
  }
}

export class CatalogSnapshot extends BaseSnapshot {
  constructor(partial: Partial<CatalogSnapshot>) {
    super();
    Object.assign(this, partial);
    this.entityType = 'CATALOG';
  }
}

export class QuoteSnapshot extends BaseSnapshot {
  constructor(partial: Partial<QuoteSnapshot>) {
    super();
    Object.assign(this, partial);
    this.entityType = 'QUOTE';
  }
}

export class ContractSnapshot extends BaseSnapshot {
  constructor(partial: Partial<ContractSnapshot>) {
    super();
    Object.assign(this, partial);
    this.entityType = 'CONTRACT';
  }
}
