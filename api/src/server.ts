import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './env';
import { logger } from './lib/logging/logger';
import { appointmentRateLimiter } from './lib/security/rateLimit';
import appointmentRoutes from './routes/appointments';
import logoRoutes from './routes/logo';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (env.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Client-Version'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
    }, 'Request completed');
  });
  
  next();
});

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API routes with rate limiting
app.use('/api', appointmentRateLimiter, appointmentRoutes);

// Logo route (no rate limiting needed for static assets)
app.use('/api', logoRoutes);

// 404 handler
app.use((_, res) => {
  res.status(404).json({
    ok: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested endpoint does not exist',
    },
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response) => {
  logger.error({ error: err }, 'Unhandled error');
  // Don't leak error details in production
  const message = env.NODE_ENV === 'production' 
    ? 'An internal error occurred' 
    : err.message;
  res.status(500).json({
    ok: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  });
});

// Start server
const PORT = env.PORT || 3001;

if (env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info({ port: PORT }, `Server running on http://localhost:${PORT}`);
  });
}

export default app;