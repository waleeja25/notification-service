export const RABBITMQ_RETRY = {
  MAX_ATTEMPTS: 3,
  HEADER: 'x-retry-count',
  BASE_DELAY_MS: 500,
} as const;

export const RABBITMQ_DLX = {
  EXCHANGE: 'notification_dlx',
  QUEUE: 'notification_dlq',
  ROUTING_KEY: 'notification.dead',
} as const;
