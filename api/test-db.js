// Test database connection for Vercel
const { Client } = require('pg');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('🔍 Testing database connection...');

  // Check all possible database env vars
  const envVars = {
    DATABASE_URL_new: !!process.env.DATABASE_URL_new,
    DIRECT_DATABASE_URL: !!process.env.DIRECT_DATABASE_URL,
    DATABASE_URL: !!process.env.DATABASE_URL,
    COMPANY_EMAIL: !!process.env.COMPANY_EMAIL,
    MAIL_FROM: !!process.env.MAIL_FROM,
    MAIL_TO_INTERNAL: !!process.env.MAIL_TO_INTERNAL,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY
  };

  console.log('Environment variables:', envVars);

  // Try to find a database connection string
  const connectionString =
    process.env.DATABASE_URL_new ||
    process.env.DIRECT_DATABASE_URL ||
    process.env.DATABASE_URL;

  if (!connectionString) {
    return res.status(500).json({
      error: 'No database connection string found',
      envVars: envVars,
      message: 'Please check Vercel environment variables'
    });
  }

  // Try to connect
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Database connected successfully');

    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');

    await client.end();

    return res.json({
      success: true,
      message: 'Database connection successful',
      database: {
        current_time: result.rows[0].current_time,
        version: result.rows[0].pg_version
      },
      envVars: envVars
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);

    return res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      envVars: envVars,
      connectionStringExists: !!connectionString,
      hint: 'Check if DATABASE_URL_new is properly set in Vercel'
    });
  }
};