import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import type { Channel, Message } from 'amqplib';
import { Observable, of } from 'rxjs';

@Catch()
export class RabbitMQExceptionFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(RabbitMQExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): Observable<unknown> {
    this.logger.error(
      `Unhandled RabbitMQ exception, sending straight to DLQ: ${
        exception instanceof Error ? exception.stack : String(exception)
      }`,
    );

    const context = host.switchToRpc().getContext<RmqContext>();
    const channel = context.getChannelRef() as Channel;
    const message = context.getMessage() as Message;

    channel.nack(message, false, false);

    return of(undefined);
  }
}
