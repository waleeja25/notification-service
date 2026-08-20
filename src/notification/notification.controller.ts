import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { NotificationService } from './notification.service';
import { RabbitMQRetryService } from '../rabbitmq';
import { EVENT_TYPES } from './constants';

import { OrderCreatedEvent, OrderDeletedEvent } from './events';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly rabbitMQRetryService: RabbitMQRetryService,
  ) {}

  @EventPattern(EVENT_TYPES.ORDER_CREATED)
  async handleOrderCreated(
    @Payload() event: OrderCreatedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.rabbitMQRetryService.handle(context, event.orderId, () =>
      this.notificationService.handleOrderCreated(event),
    );
  }
  @EventPattern(EVENT_TYPES.ORDER_DELETED)
  async handleOrderDeleted(
    @Payload() event: OrderDeletedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.rabbitMQRetryService.handle(context, event.orderId, () =>
      this.notificationService.handleOrderDeleted(event),
    );
  }
}
