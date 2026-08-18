import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import type { Channel, Message } from 'amqplib';
import { NotificationService } from './notification.service';

import type { OrderCreatedEvent } from './events';
import { RABBITMQ_RETRY } from './rabbitmq';
import { parseRabbitMQMessage } from './rabbitmq';

@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('order.created')
  handleOrderCreated(
    @Payload() event: OrderCreatedEvent,
    @Ctx() context: RmqContext,
  ): void {
    const channel = context.getChannelRef() as Channel;
    const msg = context.getMessage() as Message;
    const retryCount = Number(
      msg.properties?.headers?.[RABBITMQ_RETRY.HEADER] ?? 0,
    );
    try {
      this.notificationService.handleOrderCreated(event);

      channel.ack(msg);
    } catch {
      if (retryCount < RABBITMQ_RETRY.MAX_ATTEMPTS) {
        const nextRetry = retryCount + 1;
        this.logger.warn(
          `Order ${event.orderId} failed. Retrying ${nextRetry} / ${RABBITMQ_RETRY.MAX_ATTEMPTS}`,
        );

        const originalMessage = parseRabbitMQMessage<OrderCreatedEvent>(
          msg.content,
        );

        channel.publish(
          '',
          'notification_queue',
          Buffer.from(JSON.stringify(originalMessage)),
          {
            persistent: true,
            headers: {
              ...msg.properties.headers,
              [RABBITMQ_RETRY.HEADER]: nextRetry,
            },
          },
        );
        channel.ack(msg);
        return;
      }
      this.logger.error(
        `Order ${event.orderId} failed after ${RABBITMQ_RETRY.MAX_ATTEMPTS} attempts. Sending to DLQ.`,
      );
      channel.nack(msg, false, false);
    }
  }
}
