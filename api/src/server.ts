import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './env';
import { logger } from './lib/logging/logger';
import appointmentRoutesV2 from './routes/appointmentsV2';
import logoRoutes from './routes/logo';
import appointmentDb from './services/appointmentDatabaseService';

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
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Idempotency-Key', 'X-Client-Version', 'x-idempotency-key', 'x-client-version'],
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

// V2 API routes with enhanced appointment system - PRIMARY
app.use('/api/v2/appointments', appointmentRoutesV2);

// Legacy V1 API routes (deprecated) - redirect to V2
app.use('/api/appointments', (_req, res) => {
  res.status(410).json({
    ok: false,
    error: {
      code: 'DEPRECATED_ENDPOINT',
      message: 'This endpoint has been deprecated. Please use /api/v2/appointments instead.',
      migrationGuide: 'https://docs.tabletech.nl/api/v2/migration'
    }
  });
});

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

// Initialize database on startup
const initializeServices = async () => {
  try {
    await appointmentDb.initializeDatabase();
    logger.info('Database services initialized');
  } catch (error) {
    logger.error('Failed to initialize database:', error);
  }
};

// Start server
const PORT = env.PORT || 3002;

if (env.NODE_ENV !== 'test') {
  initializeServices().then(() => {
    app.listen(PORT, () => {
      logger.info({ port: PORT }, `Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;