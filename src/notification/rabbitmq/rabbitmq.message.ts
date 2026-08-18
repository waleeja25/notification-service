interface RabbitMQMessage<T> {
  pattern: string;
  data: T;
}

export function parseRabbitMQMessage<T>(content: Buffer): RabbitMQMessage<T> {
  return JSON.parse(content.toString()) as RabbitMQMessage<T>;
}
