import { WorkflowEngineService } from './workflow.service';
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowEngineService);
    executeTransition(req: any, workflowVersionId: string, body: {
        currentStateId: string;
        actionName: string;
        contextPayload: any;
    }): Promise<{
        success: boolean;
        data: {
            targetStateId: string;
        };
    }>;
}
