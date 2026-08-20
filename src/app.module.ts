import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { NotificationModule } from './notification';

@Module({
  imports: [AppConfigModule, NotificationModule],
})
export class AppModule {}
