import { PaymentsService } from './payments.service';
import type { SubmitPaymentDto } from './payments.service';
export declare class PaymentsController {
    private readonly service;
    constructor(service: PaymentsService);
    submitPayment(dto: SubmitPaymentDto): Promise<{
        id: string;
    }>;
    approvePayment(id: string): Promise<{
        success: boolean;
    }>;
    rejectPayment(id: string, dto: {
        rejectionReason: string;
    }): Promise<{
        success: boolean;
    }>;
    refundPayment(id: string, dto: {
        refundReason: string;
    }): Promise<{
        success: boolean;
    }>;
}
