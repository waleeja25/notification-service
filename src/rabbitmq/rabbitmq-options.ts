import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

import { RABBITMQ_DLX } from './constants';

export function getRabbitMQOptions(configService: ConfigService): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('rabbitmq.url')],
      queue: configService.getOrThrow<string>('rabbitmq.queue'),

      noAck: false,

      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': RABBITMQ_DLX.EXCHANGE,
          'x-dead-letter-routing-key': RABBITMQ_DLX.ROUTING_KEY,
        },
      },
    },
  };
}
