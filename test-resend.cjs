async function testResendAPI() {
  try {
    console.log('🧪 Testing Resend API directly...');
    
    const apiKey = 're_KDb9jyxe_6Xd3MB7JuxVT8KopL3uDa8Px'; // From .env file
    
    const emailData = {
      from: 'TableTech Team <onboarding@resend.dev>',
      to: 'info@tabletech.nl',
      subject: '🧪 TEST EMAIL - TableTech API Verificatie',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E86C28;">🧪 TableTech Email Test</h2>
          <p>Dit is een test email om te verifiëren dat het email systeem correct werkt.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>✅ API Status:</strong> Werkend</p>
            <p><strong>📧 Email Service:</strong> Resend</p>
            <p><strong>🕐 Tijd:</strong> ${new Date().toLocaleString('nl-NL')}</p>
          </div>
          <p>Als je deze email ontvangt, dan werkt het TableTech email systeem correct!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Automatisch verzonden via TableTech API test
          </p>
        </div>
      `,
      text: `
🧪 TableTech Email Test

Dit is een test email om te verifiëren dat het email systeem correct werkt.

✅ API Status: Werkend
📧 Email Service: Resend  
🕐 Tijd: ${new Date().toLocaleString('nl-NL')}

Als je deze email ontvangt, dan werkt het TableTech email systeem correct!

Automatisch verzonden via TableTech API test
      `
    };
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Test email sent successfully!');
      console.log('📧 Email ID:', result.id);
      console.log('🎯 Check your inbox at info@tabletech.nl');
    } else {
      console.log('❌ Test email failed!');
      console.log('🚨 Error:', result);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testResendAPI();
