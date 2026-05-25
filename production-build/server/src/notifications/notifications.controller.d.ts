import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            message: string;
            type: string;
            read: boolean;
        }[];
    }>;
}
