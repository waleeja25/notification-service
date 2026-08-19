import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import type { Channel, Message } from 'amqplib';

import { RABBITMQ_RETRY } from './rabbitmq.constants';
import { parseRabbitMQMessage } from './rabbitmq.message';

@Injectable()
export class RabbitMQRetryService {
  private readonly logger = new Logger(RabbitMQRetryService.name);

  handle(
    context: RmqContext,
    identifier: string | number,
    handler: () => void,
  ): void {
    const channel = context.getChannelRef() as Channel;
    const msg = context.getMessage() as Message;
    const retryCount = Number(
      msg.properties?.headers?.[RABBITMQ_RETRY.HEADER] ?? 0,
    );

    try {
      handler();

      channel.ack(msg);
    } catch {
      if (retryCount < RABBITMQ_RETRY.MAX_ATTEMPTS) {
        const nextRetry = retryCount + 1;
        this.logger.warn(
          `Message ${identifier} failed. Retrying ${nextRetry} / ${RABBITMQ_RETRY.MAX_ATTEMPTS}`,
        );

        const originalMessage = parseRabbitMQMessage(msg.content);

        channel.publish(
          '',
          msg.fields.routingKey,
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
        `Message ${identifier} failed after ${RABBITMQ_RETRY.MAX_ATTEMPTS} attempts. Sending to DLQ.`,
      );
      channel.nack(msg, false, false);
    }
  }
}
