// Debug endpoint to check environment variables
module.exports = async function handler(req, res) {
  // Only allow in development or with special header for security
  const isDev = process.env.NODE_ENV === 'development';
  const hasDebugHeader = req.headers['x-debug-auth'] === 'tabletech-debug-2024';
  
  if (!isDev && !hasDebugHeader) {
    return res.status(403).json({ error: 'Debug endpoint not accessible' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-debug-auth');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for Resend-related environment variables
    const envVars = {
      RESEND_API_KEY: {
        exists: !!process.env.RESEND_API_KEY,
        preview: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'NOT_SET'
      },
      MAIL_FROM: {
        exists: !!process.env.MAIL_FROM,
        value: process.env.MAIL_FROM || 'NOT_SET'
      },
      FROM_EMAIL: {
        exists: !!process.env.FROM_EMAIL,
        value: process.env.FROM_EMAIL || 'NOT_SET'
      },
      COMPANY_EMAIL: {
        exists: !!process.env.COMPANY_EMAIL,
        value: process.env.COMPANY_EMAIL || 'NOT_SET'
      },
      NODE_ENV: {
        exists: !!process.env.NODE_ENV,
        value: process.env.NODE_ENV || 'NOT_SET'
      }
    };

    // List all environment variables that contain 'RESEND' or 'MAIL'
    const relevantEnvKeys = Object.keys(process.env).filter(key => 
      key.includes('RESEND') || 
      key.includes('MAIL') || 
      key.includes('EMAIL')
    );

    console.log('🔍 Environment Variables Debug Check');
    console.log('   RESEND_API_KEY exists:', envVars.RESEND_API_KEY.exists);
    console.log('   Relevant env keys found:', relevantEnvKeys);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      envVars,
      relevantKeys: relevantEnvKeys,
      recommendations: {
        resend: !envVars.RESEND_API_KEY.exists ? 'Add RESEND_API_KEY to Vercel environment variables' : 'RESEND_API_KEY is configured',
        from: !envVars.MAIL_FROM.exists && !envVars.FROM_EMAIL.exists ? 'Consider adding MAIL_FROM or FROM_EMAIL' : 'From email is configured'
      }
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};