export const RABBITMQ_RETRY = {
  MAX_ATTEMPTS: 3,
  HEADER: 'x-retry-count',
} as const;
