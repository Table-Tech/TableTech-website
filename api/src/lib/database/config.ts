import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Neon PostgreSQL Database Configuration
 * Using connection pooling for optimal performance
 */

// Parse connection string or use individual components
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_CONNECTION_STRING;

const poolConfig: PoolConfig = connectionString 
  ? {
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.DB_HOST || 'ep-nameless-leaf-a299bh1h-pooler.eu-central-1.aws.neon.tech',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'neondb',
      user: process.env.DB_USER || 'neondb_owner',
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      },
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

// Create connection pool
export const pool = new Pool(poolConfig);

// Connection test
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Query helper with automatic client management
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

// Transaction helper
export const transaction = async (callback: (client: any) => Promise<any>) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Graceful shutdown
export const closePool = async () => {
  await pool.end();
  console.log('Database pool closed');
};

// Handle process termination
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

export default {
  pool,
  query,
  transaction,
  testConnection,
  closePool
};