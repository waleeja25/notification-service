import * as amqp from 'amqplib';

import { RABBITMQ_DLX } from './rabbitmq.constants';

export async function setupDeadLetterQueue(url: string): Promise<void> {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  await channel.assertExchange(RABBITMQ_DLX.EXCHANGE, 'direct', {
    durable: true,
  });
  await channel.assertQueue(RABBITMQ_DLX.QUEUE, { durable: true });
  await channel.bindQueue(
    RABBITMQ_DLX.QUEUE,
    RABBITMQ_DLX.EXCHANGE,
    RABBITMQ_DLX.ROUTING_KEY,
  );

  await channel.close();
  await connection.close();
}
