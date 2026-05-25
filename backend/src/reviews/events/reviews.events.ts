export class ReviewCreatedEvent {
  constructor(
    public readonly tenantId: string,
    public readonly reviewId: string,
    public readonly documentId: string,
    public readonly type: string,
  ) {}
}

export class ReviewDecisionMadeEvent {
  constructor(
    public readonly tenantId: string,
    public readonly reviewId: string,
    public readonly decision: string,
  ) {}
}
