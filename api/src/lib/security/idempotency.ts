import { createHash } from 'crypto';
import { logger } from '../logging/logger';

interface IdempotencyRecord {
  requestId: string;
  bodyHash: string;
  timestamp: number;
  response?: unknown;
}

// In-memory cache (can be replaced with Redis)
const cache = new Map<string, IdempotencyRecord>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  for (const [key, record] of cache.entries()) {
    if (now - record.timestamp > fiveMinutes) {
      cache.delete(key);
    }
  }
}, 60000);

// Hash request body for comparison
const hashBody = (body: unknown): string => {
  const normalized = JSON.stringify(body, Object.keys(body as Record<string, unknown>).sort());
  return createHash('sha256').update(normalized).digest('hex');
};

// Check for duplicate request
export const checkIdempotencyRecord = (
  idempotencyKey: string,
  body: unknown
): { isDuplicate: boolean; requestId?: string; response?: unknown } => {
  const record = cache.get(idempotencyKey);
  
  if (!record) {
    return { isDuplicate: false };
  }
  
  const bodyHash = hashBody(body);
  
  // If body is different, it's not a true duplicate
  if (record.bodyHash !== bodyHash) {
    logger.warn({ idempotencyKey }, 'Idempotency key reused with different body');
    return { isDuplicate: false };
  }
  
  // It's a duplicate request
  return {
    isDuplicate: true,
    requestId: record.requestId,
    response: record.response,
  };
};

// Store idempotency record
export const storeIdempotency = (
  idempotencyKey: string,
  requestId: string,
  body: unknown,
  response?: unknown
): void => {
  cache.set(idempotencyKey, {
    requestId,
    bodyHash: hashBody(body),
    timestamp: Date.now(),
    response,
  });
};

// Update response for existing record
export const updateIdempotencyResponse = (idempotencyKey: string, response: unknown): void => {
  const record = cache.get(idempotencyKey);
  if (record) {
    record.response = response;
  }
};

// Express middleware for idempotency
export const checkIdempotency = (req: any, res: any, next: any) => {
  const idempotencyKey = req.headers['x-idempotency-key'] || req.headers['idempotency-key'];
  
  if (!idempotencyKey) {
    return next(); // Not required, continue
  }
  
  const result = checkIdempotencyRecord(idempotencyKey, req.body);
  
  if (result.isDuplicate && result.response) {
    return res.json(result.response);
  }
  
  // Store the key for later response storage
  req.idempotencyKey = idempotencyKey;
  next();
};