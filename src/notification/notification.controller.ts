import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: unknown): void {
    console.log('Received order.created event:', data);
  }
}