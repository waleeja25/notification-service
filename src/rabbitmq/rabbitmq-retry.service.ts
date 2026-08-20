import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import type { Channel, Message } from 'amqplib';

import { RABBITMQ_RETRY } from './rabbitmq.constants';
import { parseRabbitMQMessage } from './rabbitmq.message';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class RabbitMQRetryService {
  private readonly logger = new Logger(RabbitMQRetryService.name);

  async handle(
    context: RmqContext,
    identifier: string | number,
    handler: () => Promise<void> | void,
  ): Promise<void> {
    const channel = context.getChannelRef() as Channel;
    const msg = context.getMessage() as Message;
    const retryCount = Number(
      msg.properties?.headers?.[RABBITMQ_RETRY.HEADER] ?? 0,
    );

    try {
      await handler();

      channel.ack(msg);
    } catch (error) {
      if (retryCount < RABBITMQ_RETRY.MAX_ATTEMPTS) {
        const nextRetry = retryCount + 1;
        const backoffMs = RABBITMQ_RETRY.BASE_DELAY_MS * 2 ** retryCount;

        this.logger.warn(
          `Message ${identifier} failed. Retrying ${nextRetry} / ${RABBITMQ_RETRY.MAX_ATTEMPTS} in ${backoffMs}ms`,
          error instanceof Error ? error.stack : error,
        );

        await delay(backoffMs);

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
        error instanceof Error ? error.stack : error,
      );
      channel.nack(msg, false, false);
    }
  }
}
