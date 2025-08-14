import pino from 'pino';
import { env } from '../../env';

// Create logger instance
export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
      colorize: true,
    },
  } : undefined,
  base: {
    env: env.NODE_ENV,
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        'x-forwarded-for': req.headers['x-forwarded-for'],
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.email', '*.phone', '*.password'],
    censor: '[REDACTED]',
  },
});

// Helper to create child logger with request context
export const createRequestLogger = (requestId: string, ipHash?: string) => {
  return logger.child({
    requestId,
    ipHash,
  });
};

export default logger;