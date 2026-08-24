# Notification Service

Consumes `order.created`/`order.deleted` events from RabbitMQ (published by `order-service`) and logs/sends the corresponding notification. This service has no HTTP surface and no database — it's a pure message consumer.

## Message handling

- Payloads are validated with `class-validator` DTOs (`OrderCreatedEvent`/`OrderDeletedEvent`) before reaching the handler.
- **Malformed message** (fails validation): skips retries entirely and is `nack`'d straight to the dead-letter queue — retrying bad data wouldn't ever succeed.
- **Handler failure** (e.g. a transient error while processing a valid message): retried up to 3 times with exponential backoff, then sent to the dead-letter queue.
- Acking is manual (`noAck: false`) — a message is only removed from the queue once it's actually been processed or given up on, not just received.

## Stack

NestJS, `amqplib` / `@nestjs/microservices` (RabbitMQ), `class-validator`

## Running locally

```bash
npm install
npm run start:dev
```

## Required env vars

```
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=notification_queue
```

## Depends on

A running RabbitMQ broker, with `notification_queue` set up with a dead-letter exchange/queue.
