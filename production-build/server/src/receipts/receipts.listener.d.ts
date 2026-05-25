import { ReceiptsService } from './receipts.service';
export declare class ReceiptsListener {
    private readonly receiptsService;
    private readonly logger;
    constructor(receiptsService: ReceiptsService);
    handlePaymentApproved(event: any): Promise<void>;
}
