import { Request, Response, NextFunction } from 'express';
import appointmentDb from '../services/appointmentDatabaseService';
import { logger } from '../lib/logging/logger';

let lastCheck = 0;
const CHECK_INTERVAL = 30000; // Check every 30 seconds

/**
 * Middleware that ensures database tables exist before each request
 * This prevents the constant table disappearing issue with Neon free tier
 */
export const ensureDatabase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = Date.now();

    // Only check periodically to avoid performance impact
    if (now - lastCheck > CHECK_INTERVAL) {
      lastCheck = now;

      logger.info('🔍 Checking database integrity...');
      await appointmentDb.initializeDatabase();
      logger.info('✅ Database integrity verified');
    }

    next();
  } catch (error) {
    logger.error('❌ Database integrity check failed:', error);

    // Try to recover
    try {
      logger.info('🔄 Attempting database recovery...');
      await appointmentDb.initializeDatabase();
      logger.info('✅ Database recovered successfully');
      next();
    } catch (recoveryError) {
      logger.error('❌ Database recovery failed:', recoveryError);

      // Return error response but don't crash the server
      res.status(503).json({
        success: false,
        error: 'Database temporarily unavailable. Please try again in a moment.',
        code: 'DATABASE_UNAVAILABLE'
      });
    }
  }
};

/**
 * Force database check and initialization
 */
export const forceDbCheck = async () => {
  try {
    logger.info('🔄 Force database check initiated...');
    await appointmentDb.initializeDatabase();
    logger.info('✅ Force database check completed');
    lastCheck = Date.now();
  } catch (error) {
    logger.error('❌ Force database check failed:', error);
    throw error;
  }
};