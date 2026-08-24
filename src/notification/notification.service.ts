import { Injectable, Logger } from '@nestjs/common';
import {
  OrderCreatedEvent,
  OrderDeletedEvent,
  UserCreatedEvent,
} from './events';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  handleOrderCreated(event: OrderCreatedEvent): void {
    this.logger.log(
      `Notification: Order #${event.orderId} has been successfully placed for user ${event.userId}.`,
    );
  }
  handleOrderDeleted(event: OrderDeletedEvent): void {
    this.logger.log(
      `Notification: Your order #${event.orderId} has been cancelled.`,
    );
  }
  handleUserCreated(event: UserCreatedEvent): void {
    this.logger.log(
      `Sending welcome notification to user ${event.userId}: "Your account has been created successfully."`,
    );
  }
}
