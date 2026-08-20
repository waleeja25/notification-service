import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

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
          'x-dead-letter-exchange': 'notification_dlx',
          'x-dead-letter-routing-key': 'notification.dead',
        },
      },
    },
  };
}
