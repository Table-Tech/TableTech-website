// Simple endpoint to check environment variables
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const envCheck = {
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || 'local',

    email: {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? {
        exists: true,
        length: process.env.RESEND_API_KEY.length,
        starts_with: process.env.RESEND_API_KEY.substring(0, 10),
        looks_valid: process.env.RESEND_API_KEY.startsWith('re_')
      } : {
        exists: false,
        error: 'NOT SET - Add RESEND_API_KEY to Vercel Environment Variables'
      },

      MAIL_FROM: process.env.MAIL_FROM || 'NOT SET',
      FROM_EMAIL: process.env.FROM_EMAIL || 'NOT SET',
      MAIL_TO_INTERNAL: process.env.MAIL_TO_INTERNAL || 'NOT SET',
      COMPANY_EMAIL: process.env.COMPANY_EMAIL || 'NOT SET'
    },

    database: {
      DATABASE_URL_new: process.env.DATABASE_URL_new ? 'SET ✅' : 'NOT SET ❌',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET ✅' : 'NOT SET ❌'
    },

    allEnvKeys: Object.keys(process.env)
      .filter(k => !k.includes('SECRET') && !k.includes('PASSWORD') && !k.includes('npm_'))
      .sort()
  };

  // Quick test of Resend API if key exists
  if (process.env.RESEND_API_KEY) {
    try {
      const testResponse = await fetch('https://api.resend.com/emails', {
        method: 'GET', // Will fail but shows if auth works
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        }
      });

      envCheck.resendApiTest = {
        status: testResponse.status,
        statusText: testResponse.statusText,
        authenticated: testResponse.status !== 401
      };
    } catch (err) {
      envCheck.resendApiTest = {
        error: err.message
      };
    }
  }

  return res.status(200).json(envCheck);
};