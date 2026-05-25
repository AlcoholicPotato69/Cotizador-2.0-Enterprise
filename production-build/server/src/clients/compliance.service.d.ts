import { Client } from '@prisma/client';
export declare class ComplianceService {
    canCreateContract(client: Client): boolean;
    canGenerateInvoice(client: Client): boolean;
    canApprovePayment(client: Client): boolean;
}
