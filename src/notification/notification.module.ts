import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RabbitMQRetryService } from '../rabbitmq';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, RabbitMQRetryService],
})
export class NotificationModule {}
