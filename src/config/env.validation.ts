import { z } from 'zod';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),

  // API Configuration
  API_PREFIX: z.string().default('api'),
  API_VERSION: z.string().default('v1'),

  // JWT (for future authentication)
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),

  // CORS
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  CORS_CREDENTIALS: z.coerce.boolean().default(true),

  // Rate Limiting
  RATE_LIMIT_TTL: z.coerce.number().positive().default(60),
  RATE_LIMIT_LIMIT: z.coerce.number().positive().default(100),

  // Redis (optional)
  REDIS_URL: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validateEnv = (): EnvConfig => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join('.'));
      const errorMessage = `❌ Invalid environment variables: ${missingVars.join(', ')}\nPlease check your .env file and ensure all required variables are set correctly.`;
      throw new Error(errorMessage);
    }
    throw error;
  }
};
