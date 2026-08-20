import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  RABBITMQ_URL: Joi.string().uri().required(),
  RABBITMQ_QUEUE: Joi.string().required(),
});
