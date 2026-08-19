import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { NotificationService } from './notification.service';
import { RabbitMQRetryService } from './rabbitmq';

import type { OrderCreatedEvent, OrderDeletedEvent } from './events';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly rabbitMQRetryService: RabbitMQRetryService,
  ) {}

  @EventPattern('order.created')
  handleOrderCreated(
    @Payload() event: OrderCreatedEvent,
    @Ctx() context: RmqContext,
  ): void {
    this.rabbitMQRetryService.handle(context, event.orderId, () =>
      this.notificationService.handleOrderCreated(event),
    );
  }
  @EventPattern('order.deleted')
  handleOrderDeleted(
    @Payload() event: OrderDeletedEvent,
    @Ctx() context: RmqContext,
  ): void {
    this.rabbitMQRetryService.handle(context, event.orderId, () =>
      this.notificationService.handleOrderDeleted(event),
    );
  }
}
