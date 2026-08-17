import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RabbitMQService } from './rabbitmq.service';
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],

        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,

          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],

            queue: configService.getOrThrow<string>('RABBITMQ_QUEUE'),

            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],

  providers: [RabbitMQService],

  exports: [RabbitMQService],
})
export class RabbitMQModule {}
