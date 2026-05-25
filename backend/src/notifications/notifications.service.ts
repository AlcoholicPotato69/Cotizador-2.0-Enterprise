import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Implement the logic to handle and dispatch notifications

  @OnEvent('notification.send')
  handleNotificationSendEvent(payload: {
    tenantId: string;
    userId: string;
    message: string;
    type: string;
  }) {
    this.logger.log(
      `Dispatching notification to user ${payload.userId} in tenant ${payload.tenantId}: ${payload.message}`,
    );
    // In a real scenario, this could send an email, push notification, SMS, or save to the DB
    this.dispatch(payload);
  }

  @OnEvent('quote.approved')
  handleQuoteApproved(payload: {
    tenantId: string;
    quoteId: string;
    userId: string;
  }) {
    this.logger.log(
      `Quote ${payload.quoteId} approved. Notifying stakeholders.`,
    );
    this.dispatch({
      tenantId: payload.tenantId,
      userId: payload.userId,
      message: `Quote ${payload.quoteId} has been approved.`,
      type: 'QUOTE_APPROVED',
    });
  }

  @OnEvent('contract.generated')
  handleContractGenerated(payload: {
    tenantId: string;
    contractId: string;
    quoteId: string;
    userId: string;
  }) {
    this.logger.log(
      `Contract ${payload.contractId} generated for Quote ${payload.quoteId}. Notifying stakeholders.`,
    );
    this.dispatch({
      tenantId: payload.tenantId,
      userId: payload.userId,
      message: `Contract ${payload.contractId} has been generated.`,
      type: 'CONTRACT_GENERATED',
    });
  }

  private dispatch(payload: {
    tenantId: string;
    userId: string;
    message: string;
    type: string;
  }) {
    // Abstract notification dispatching logic
    this.logger.debug(
      `[${payload.type}] -> User: ${payload.userId} | Msg: ${payload.message}`,
    );
  }

  async getNotificationsForUser(tenantId: string, userId: string) {
    // Dummy implementation for fetching from DB
    return [
      {
        id: '1',
        message: 'Welcome to the system',
        type: 'SYSTEM',
        read: false,
      },
    ];
  }
}
