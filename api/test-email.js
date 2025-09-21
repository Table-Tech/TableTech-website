// Test endpoint to debug email sending
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('🔍 Email Test Endpoint Called');
  console.log('Method:', req.method);

  // Check environment variables
  const envCheck = {
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasCompanyEmail: !!process.env.COMPANY_EMAIL,
    hasMailFrom: !!process.env.MAIL_FROM,
    hasFromEmail: !!process.env.FROM_EMAIL,
    hasMailToInternal: !!process.env.MAIL_TO_INTERNAL,
    hasDatabaseUrl: !!process.env.DATABASE_URL_new || !!process.env.DATABASE_URL,
  };

  // Parse MAIL_FROM to check format
  let parsedMailFrom = null;
  if (process.env.MAIL_FROM) {
    const mailFrom = process.env.MAIL_FROM;
    parsedMailFrom = {
      raw: mailFrom,
      hasAngleBrackets: mailFrom.includes('<') && mailFrom.includes('>'),
      hasAtSymbol: mailFrom.includes('@'),
      cleaned: mailFrom.replace(/["']/g, '').trim(),
    };
  }

  if (req.method === 'GET') {
    // Just return environment status
    return res.status(200).json({
      status: 'Email test endpoint active',
      environment: envCheck,
      mailFromFormat: parsedMailFrom,
      resendKeyPrefix: process.env.RESEND_API_KEY
        ? process.env.RESEND_API_KEY.substring(0, 10) + '...'
        : 'Not set',
      companyEmail: process.env.COMPANY_EMAIL || 'Not set',
      recommendation: !envCheck.hasResendKey
        ? 'Set RESEND_API_KEY in Vercel environment variables'
        : parsedMailFrom && !parsedMailFrom.hasAngleBrackets
        ? 'Fix MAIL_FROM format to: TableTech <noreply@tabletech.nl>'
        : 'Configuration looks good'
    });
  }

  if (req.method === 'POST') {
    // Actually try to send a test email
    const { testEmail } = req.body;
    const targetEmail = testEmail || 'info@tabletech.nl';

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error: 'RESEND_API_KEY not configured',
        solution: 'Add RESEND_API_KEY to Vercel environment variables'
      });
    }

    try {
      // Determine from email
      let fromEmail = 'TableTech <info@tabletech.nl>';

      if (process.env.MAIL_FROM) {
        const cleanFrom = process.env.MAIL_FROM
          .replace(/["']/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        if (cleanFrom.includes('<') && cleanFrom.includes('>')) {
          fromEmail = cleanFrom;
        } else if (cleanFrom.includes('@')) {
          const emailMatch = cleanFrom.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
          if (emailMatch) {
            const email = emailMatch[1];
            const namePart = cleanFrom.replace(email, '').trim();
            fromEmail = `${namePart || 'TableTech'} <${email}>`;
          }
        }
      }

      console.log('Sending test email...');
      console.log('From:', fromEmail);
      console.log('To:', targetEmail);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [targetEmail],
          subject: 'TableTech Email Test - ' + new Date().toISOString(),
          html: `
            <h1>Email Test Successful!</h1>
            <p>This is a test email from TableTech appointment system.</p>
            <p>If you receive this, the email configuration is working correctly.</p>
            <hr>
            <p><strong>Configuration:</strong></p>
            <ul>
              <li>From: ${fromEmail}</li>
              <li>Environment: ${process.env.VERCEL_ENV || 'local'}</li>
              <li>Timestamp: ${new Date().toISOString()}</li>
            </ul>
          `
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return res.status(200).json({
          success: true,
          message: 'Test email sent successfully',
          emailId: result.id,
          from: fromEmail,
          to: targetEmail,
          resendResponse: result
        });
      } else {
        return res.status(400).json({
          error: 'Resend API error',
          status: response.status,
          details: result,
          from: fromEmail,
          configuration: {
            mailFrom: process.env.MAIL_FROM,
            suggestion: 'Check if domain is verified in Resend dashboard'
          }
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to send test email',
        message: error.message,
        stack: error.stack
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};