# Notification Service

Consumes `order.created`, `order.deleted`, and `user.created` events from RabbitMQ (published by `order-service` and `user-service`) and logs/sends the corresponding notification. No HTTP surface, no database — a pure message consumer.

## Message handling

- Payloads are validated with `class-validator` DTOs before reaching the handler.
- **Malformed message**: skips retries and is `nack`'d straight to the dead-letter queue.
- **Handler failure**: retried with exponential backoff, then dead-lettered if retries are exhausted.
- Acking is manual (`noAck: false`). The dead-letter exchange/queue/binding are created in code on startup, not provisioned manually.

## Stack

NestJS, `amqplib` / `@nestjs/microservices` (RabbitMQ), `class-validator`

## Folder structure

```
src/
├── notification/           # controller, service, events, event-type constants
├── rabbitmq/
│   ├── rabbitmq-options.ts  # consumer connection config
│   ├── rabbitmq-dlq.ts      # creates the DLX/DLQ on startup
│   ├── constants/
│   └── retry/                # retry service, exception filter, message parser
└── config/
```

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

A running RabbitMQ broker.
