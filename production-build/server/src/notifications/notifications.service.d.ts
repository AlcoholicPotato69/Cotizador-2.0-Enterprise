export declare class NotificationsService {
    private readonly logger;
    handleNotificationSendEvent(payload: {
        tenantId: string;
        userId: string;
        message: string;
        type: string;
    }): void;
    handleQuoteApproved(payload: {
        tenantId: string;
        quoteId: string;
        userId: string;
    }): void;
    handleContractGenerated(payload: {
        tenantId: string;
        contractId: string;
        quoteId: string;
        userId: string;
    }): void;
    private dispatch;
    getNotificationsForUser(tenantId: string, userId: string): Promise<{
        id: string;
        message: string;
        type: string;
        read: boolean;
    }[]>;
}
