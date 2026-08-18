import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { AppConfigModule } from './config/config.module';

async function bootstrap() {
  const configContext =
    await NestFactory.createApplicationContext(AppConfigModule);
  const configService = configContext.get(ConfigService);

  const rabbitmqUrl = configService.getOrThrow<string>('rabbitmq.url');
  const rabbitmqQueue = configService.getOrThrow<string>('rabbitmq.queue');

  await configContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,

      options: {
        urls: [rabbitmqUrl],
        queue: rabbitmqQueue,

        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();

  console.log('Notification Service is listening to RabbitMQ');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
