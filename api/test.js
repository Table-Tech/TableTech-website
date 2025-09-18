// Test endpoint for debugging
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('🧪 Test endpoint called');

  const envInfo = {
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV,
    database_vars: {
      DATABASE_URL_new: !!process.env.DATABASE_URL_new,
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_DATABASE_URL: !!process.env.DIRECT_DATABASE_URL
    },
    email_vars: {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      MAIL_FROM: process.env.MAIL_FROM || 'not set',
      MAIL_TO_INTERNAL: process.env.MAIL_TO_INTERNAL || 'not set'
    },
    runtime: {
      node_version: process.version,
      platform: process.platform,
      memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB / ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    },
    request_info: {
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
        origin: req.headers.origin,
        referer: req.headers.referer
      }
    }
  };

  // Test database connection if available
  if (process.env.DATABASE_URL_new || process.env.DATABASE_URL) {
    const { Client } = require('pg');
    const connectionString = process.env.DATABASE_URL_new || process.env.DATABASE_URL;

    try {
      const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
      });

      await client.connect();
      const result = await client.query('SELECT version(), current_database(), current_user');
      await client.end();

      envInfo.database_test = {
        success: true,
        version: result.rows[0].version,
        database: result.rows[0].current_database,
        user: result.rows[0].current_user
      };
    } catch (error) {
      envInfo.database_test = {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  } else {
    envInfo.database_test = {
      success: false,
      error: 'No database configuration found'
    };
  }

  return res.status(200).json(envInfo);
};