import rateLimit from 'express-rate-limit';
import { env } from '../../env';
import { createHash } from 'crypto';
import { Request } from 'express';

// Hash IP for privacy
export const hashIP = (ip: string): string => {
  return createHash('sha256').update(ip + 'tabletech-salt').digest('hex').substring(0, 16);
};

// Get client IP from request
export const getClientIP = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
};

// Memory store for rate limiting (can be replaced with Redis)
const memoryStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of memoryStore.entries()) {
    if (value.resetTime < now) {
      memoryStore.delete(key);
    }
  }
}, 60000);

// Custom key generator that uses hashed IP
const keyGenerator = (req: Request): string => {
  const ip = getClientIP(req);
  return hashIP(ip);
};

// Rate limiter middleware
export const appointmentRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: (_, res) => {
    res.status(429).json({
      ok: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Te veel aanvragen. Probeer het over ${Math.ceil(env.RATE_LIMIT_WINDOW / 60000)} minuten opnieuw.`,
      },
    });
  },
  skip: () => {
    // Skip rate limiting in test and development environment for easy testing
    return env.NODE_ENV === 'test' || env.NODE_ENV === 'development';
  },
});

// Manual rate limit check for custom logic
export const checkRateLimit = (key: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = memoryStore.get(key);
  
  if (!record || record.resetTime < now) {
    memoryStore.set(key, {
      count: 1,
      resetTime: now + env.RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: env.RATE_LIMIT_MAX - 1 };
  }
  
  if (record.count >= env.RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: env.RATE_LIMIT_MAX - record.count };
};