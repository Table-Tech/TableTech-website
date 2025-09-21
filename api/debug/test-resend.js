// Test endpoint to verify Resend API connection
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧪 Testing Resend API connection...');

    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.log('❌ RESEND_API_KEY not found in environment variables');
      console.log('Available env vars containing RESEND or MAIL:', 
        Object.keys(process.env).filter(k => k.includes('RESEND') || k.includes('MAIL'))
      );
      
      return res.status(500).json({
        error: 'RESEND_API_KEY not configured',
        solution: 'Add RESEND_API_KEY to your Vercel environment variables',
        availableVars: Object.keys(process.env).filter(k => k.includes('RESEND') || k.includes('MAIL'))
      });
    }

    console.log('✅ RESEND_API_KEY found:', process.env.RESEND_API_KEY.substring(0, 10) + '...');

    // Test email details from request body or use defaults
    const { testEmail } = req.body;
    const recipientEmail = testEmail || 'test@tabletech.nl';

    // Prepare test email
    const emailData = {
      from: 'TableTech <info@tabletech.nl>',
      to: [recipientEmail],
      subject: 'TableTech API Test - ' + new Date().toISOString(),
      html: `
        <h2>🧪 TableTech API Test Email</h2>
        <p>Dit is een test email om te controleren of de Resend API correct werkt.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>API Key gebruikt:</strong> ${process.env.RESEND_API_KEY.substring(0, 10)}...</p>
        <hr>
        <p><small>Deze email is automatisch gegenereerd door de TableTech API test functie.</small></p>
      `
    };

    console.log('📧 Sending test email to:', recipientEmail);
    console.log('📧 Using from address:', emailData.from);

    // Make request to Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Resend API error:', response.status, result);
      
      let errorMessage = 'Unknown error';
      let solution = 'Check your Resend API configuration';

      if (response.status === 401) {
        errorMessage = 'Invalid API key';
        solution = 'Check if your RESEND_API_KEY is correct. You may need to regenerate it in your Resend dashboard.';
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden';
        solution = 'Check your Resend account permissions and domain verification.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded';
        solution = 'Too many requests. Wait a moment and try again.';
      }

      return res.status(response.status).json({
        error: errorMessage,
        solution,
        status: response.status,
        details: result,
        apiKeyPreview: process.env.RESEND_API_KEY.substring(0, 10) + '...'
      });
    }

    console.log('✅ Test email sent successfully!');
    console.log('Email ID:', result.id);

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: result.id,
      recipient: recipientEmail,
      timestamp: new Date().toISOString(),
      apiKeyPreview: process.env.RESEND_API_KEY.substring(0, 10) + '...'
    });

  } catch (error) {
    console.error('🚨 Test email error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      type: error.name
    });
  }
};