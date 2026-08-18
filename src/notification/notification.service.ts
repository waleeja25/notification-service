import { Injectable, Logger } from '@nestjs/common';
import { OrderCreatedEvent } from './events';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  handleOrderCreated(event: OrderCreatedEvent): void {
    this.logger.log(
      `Notifying user ${event.userId} about order ${event.orderId}`,
    );
  }
}
