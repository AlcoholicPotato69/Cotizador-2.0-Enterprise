export interface ApprovalStep {
    id: string;
    decision: string;
    order: number;
    quorum?: number;
    approverId?: string;
}
export declare class ApprovalsService {
    evaluateAdvancedWorkflow(requestId: string): Promise<string>;
    private groupByOrder;
    private updateStatus;
    private needsEscalation;
    private escalateStep;
    delegateApproval(stepId: string, newApproverId: string): Promise<void>;
}
