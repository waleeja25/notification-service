import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { AppModule } from './app.module';
import { getRabbitMQOptions } from './rabbitmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new RpcException(
          errors
            .flatMap((error) => Object.values(error.constraints ?? {}))
            .join('; '),
        ),
    }),
  );

  app.connectMicroservice<MicroserviceOptions>(
    getRabbitMQOptions(configService),
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();

  console.log('Notification Service is listening to RabbitMQ');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
