// Debug endpoint to check environment variables
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const debug = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL: process.env.VERCEL || 'not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      VERCEL_URL: process.env.VERCEL_URL || 'not set'
    },
    database: {
      DATABASE_URL_new: !!process.env.DATABASE_URL_new ? 'SET ✅' : 'NOT SET ❌',
      DATABASE_URL: !!process.env.DATABASE_URL ? 'SET ✅' : 'NOT SET ❌',
      DIRECT_DATABASE_URL: !!process.env.DIRECT_DATABASE_URL ? 'SET ✅' : 'NOT SET ❌',
      connection_string_preview: process.env.DATABASE_URL_new ?
        process.env.DATABASE_URL_new.substring(0, 30) + '...' : 'none'
    },
    email: {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY ? 'SET ✅' : 'NOT SET ❌',
      MAIL_FROM: process.env.MAIL_FROM || 'not set',
      MAIL_TO_INTERNAL: process.env.MAIL_TO_INTERNAL || 'not set'
    },
    all_env_keys: Object.keys(process.env)
      .filter(k => !k.includes('SECRET') && !k.includes('PASSWORD'))
      .sort()
  };

  return res.status(200).json(debug);
};