// Test endpoint voor Resend email configuratie
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('📧 Testing email configuration...');

  // Check environment variables
  const config = {
    timestamp: new Date().toISOString(),
    environment: {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ SET' : '❌ NOT SET',
      RESEND_API_KEY_LENGTH: process.env.RESEND_API_KEY?.length || 0,
      RESEND_API_KEY_PREFIX: process.env.RESEND_API_KEY?.substring(0, 10) || 'none',
      MAIL_FROM: process.env.MAIL_FROM || 'not set',
      MAIL_TO_INTERNAL: process.env.MAIL_TO_INTERNAL || 'not set',
      FROM_EMAIL: process.env.FROM_EMAIL || 'not set',
      COMPANY_EMAIL: process.env.COMPANY_EMAIL || 'not set'
    },
    vercelEnv: process.env.VERCEL_ENV || 'not in vercel'
  };

  // If POST request, try to send test email
  if (req.method === 'POST') {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        error: 'Email address required in body',
        example: { email: 'test@example.com' }
      });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error: 'RESEND_API_KEY not configured',
        config,
        help: 'Add RESEND_API_KEY to Vercel Environment Variables'
      });
    }

    try {
      console.log('🚀 Attempting to send test email to:', email);
      console.log('Using API Key:', process.env.RESEND_API_KEY.substring(0, 10) + '...');

      // Fix from email format
      let fromEmail = 'TableTech <info@tabletech.nl>';
      if (process.env.MAIL_FROM) {
        fromEmail = process.env.MAIL_FROM.replace(/["']/g, '');
      } else if (process.env.FROM_EMAIL) {
        const cleanEmail = process.env.FROM_EMAIL.replace(/["']/g, '');
        fromEmail = `TableTech <${cleanEmail}>`;
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: '🧪 Test Email from TableTech',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00d4ff;">Test Email Successful! ✅</h2>
              <p>This is a test email from your TableTech appointment system.</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;">
              <h3>Configuration Status:</h3>
              <ul>
                <li>Sent at: ${new Date().toISOString()}</li>
                <li>Environment: ${process.env.VERCEL_ENV || 'development'}</li>
                <li>From: ${process.env.MAIL_FROM || process.env.FROM_EMAIL || 'info@tabletech.nl'}</li>
                <li>API Key: ${process.env.RESEND_API_KEY?.substring(0, 10)}...</li>
              </ul>
              <hr style="border: 1px solid #eee; margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">
                If you received this email, your Resend configuration is working correctly!
              </p>
            </div>
          `,
        }),
      });

      const result = await response.json();

      console.log('📬 Resend API Response:', result);

      if (!response.ok) {
        console.error('❌ Resend API Error:', result);
        return res.status(response.status).json({
          error: 'Resend API error',
          status: response.status,
          details: result,
          config,
          possibleIssues: [
            'Invalid API key',
            'Domain not verified in Resend',
            'Rate limit exceeded',
            'Invalid from email address'
          ]
        });
      }

      return res.status(200).json({
        success: true,
        message: `Test email sent to ${email}`,
        resendId: result.id,
        config,
        resendResponse: result
      });

    } catch (error) {
      console.error('❌ Email send error:', error);
      return res.status(500).json({
        error: 'Failed to send email',
        message: error.message,
        config,
        stack: error.stack
      });
    }
  }

  // GET request - just show configuration
  return res.status(200).json(config);
};