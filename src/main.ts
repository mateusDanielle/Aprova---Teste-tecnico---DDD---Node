import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);

  // Setup Swagger
  setupSwagger(app);

  // Enable CORS
  app.enableCors({
    origin: configService.corsOrigin,
    credentials: configService.corsCredentials,
  });

  // Global prefix
  app.setGlobalPrefix(configService.apiPrefix);

  await app.listen(configService.port);

  console.log(
    `🚀 Application is running on: http://localhost:${configService.port}`,
  );
  console.log(
    `📚 Swagger documentation: http://localhost:${configService.port}/api`,
  );
}
void bootstrap();
