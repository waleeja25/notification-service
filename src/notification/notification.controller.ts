import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

import type { OrderCreatedEvent } from './events';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('order.created')
  handleOrderCreated(@Payload() event: OrderCreatedEvent): void {
    this.notificationService.handleOrderCreated(event);
  }
}
