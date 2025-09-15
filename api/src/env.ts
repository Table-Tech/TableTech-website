import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const envSchema = z.object({
  // Node
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3002').transform(Number),
  
  // Email
  RESEND_API_KEY: z.string().min(1),
  MAIL_FROM: z.string().email().or(z.string().regex(/^.+\s<.+@.+>$/)).default('TableTech Team <noreply@tabletech.nl>'),
  MAIL_TO_INTERNAL: z.string().email().default('info@tabletech.nl'),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // Brand
  BRAND_NAME: z.string().default('TableTech'),
  BRAND_COLOR: z.string().default('#E86C28'),
  ACCENT_COLOR: z.string().default('#FFB366'),
  SUPPORT_EMAIL: z.string().email().default('info@tabletech.nl'),
  WEBSITE_URL: z.string().url().default('https://tabletech.nl'),
  ADDRESS: z.string().default('Biezelingeplein 32, 3086 SB Rotterdam, Nederland'),
  PUBLIC_FAVICON_URL: z.string().url().default('https://tabletech.nl/favicon.ico'),
  
  // Security
  ENABLE_CAPTCHA: z.string().transform(v => v === 'true').default('true'),
  CAPTCHA_PROVIDER: z.enum(['hcaptcha', 'turnstile', 'recaptcha']).default('turnstile'),
  CAPTCHA_SECRET: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_MAX: z.string().transform(Number).default('5'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('600000'),
  
  // Anti-Spam
  ENABLE_DISPOSABLE_CHECK: z.string().transform(v => v === 'true').default('true'),
  DISPOSABLE_DOMAINS_PATH: z.string().optional(),
  MIN_FORM_FILL_TIME: z.string().transform(Number).default('1200'),
  MAX_URLS_IN_MESSAGE: z.string().transform(Number).default('3'),
  MAX_MESSAGE_LENGTH: z.string().transform(Number).default('5000'),
  
  // Redis
  REDIS_URL: z.string().optional(),
  
  // CORS
  ALLOWED_ORIGINS: z.string().transform(v => v.split(',')).default('https://tabletech.nl,http://localhost:5173'),
  
  // Logging
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

// Validate and export environment variables
export const env = envSchema.parse(process.env);

// Export for use in other files
export default env;