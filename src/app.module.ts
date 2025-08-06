import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    ApplicationModule,
    PresentationModule,
  ],
})
export class AppModule {}
