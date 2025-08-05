import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env.validation';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<EnvConfig, true>) {}

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL', { infer: true });
  }

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true });
  }

  get apiPrefix(): string {
    return this.configService.get('API_PREFIX', { infer: true });
  }

  get apiVersion(): string {
    return this.configService.get('API_VERSION', { infer: true });
  }

  get jwtSecret(): string | undefined {
    return this.configService.get('JWT_SECRET', { infer: true });
  }

  get jwtExpiresIn(): string {
    return this.configService.get('JWT_EXPIRES_IN', { infer: true });
  }

  get logLevel(): string {
    return this.configService.get('LOG_LEVEL', { infer: true });
  }

  get corsOrigin(): string {
    return this.configService.get('CORS_ORIGIN', { infer: true });
  }

  get corsCredentials(): boolean {
    return this.configService.get('CORS_CREDENTIALS', { infer: true });
  }

  get rateLimitTtl(): number {
    return this.configService.get('RATE_LIMIT_TTL', { infer: true });
  }

  get rateLimitLimit(): number {
    return this.configService.get('RATE_LIMIT_LIMIT', { infer: true });
  }

  get redisUrl(): string | undefined {
    return this.configService.get('REDIS_URL', { infer: true });
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }
}
