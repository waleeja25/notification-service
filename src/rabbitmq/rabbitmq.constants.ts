export const RABBITMQ_RETRY = {
  MAX_ATTEMPTS: 3,
  HEADER: 'x-retry-count',
  BASE_DELAY_MS: 500,
} as const;
