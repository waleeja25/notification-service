import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppConfigModule } from './config';
import { NotificationModule } from './notification';
import { RabbitMQExceptionFilter } from './rabbitmq';

@Module({
  imports: [AppConfigModule, NotificationModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RabbitMQExceptionFilter,
    },
  ],
})
export class AppModule {}
