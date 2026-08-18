import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { rabbitmqConfig } from './rabbitmq.config';
import { envValidationSchema } from './validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [rabbitmqConfig],
      validationSchema: envValidationSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
