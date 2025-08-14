#!/usr/bin/env node

require('dotenv').config();

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResendDirectly() {
  console.log('🧪 Testing Resend API directly...');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set (***' + process.env.RESEND_API_KEY.slice(-4) + ')' : 'NOT SET');
  console.log('MAIL_FROM:', process.env.MAIL_FROM);
  console.log('MAIL_TO_INTERNAL:', process.env.MAIL_TO_INTERNAL);
  
  try {
    console.log('\n📧 Sending test email...');
    
    const result = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO_INTERNAL,
      subject: 'TableTech Email Test - ' + new Date().toLocaleTimeString(),
      html: `
        <h1>TableTech Email Test</h1>
        <p>Dit is een test email om te controleren of het email systeem werkt.</p>
        <p><strong>Tijd:</strong> ${new Date().toLocaleString('nl-NL')}</p>
        <p><strong>Van:</strong> TableTech API Test</p>
      `,
      text: `
TableTech Email Test

Dit is een test email om te controleren of het email systeem werkt.
Tijd: ${new Date().toLocaleString('nl-NL')}
Van: TableTech API Test
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('Response:', result);
    
    if (result.data?.id) {
      console.log(`📨 Message ID: ${result.data.id}`);
      console.log('🎉 Email system is working!');
    }
    
    if (result.error) {
      console.log('❌ Email error:', result.error);
    }

  } catch (error) {
    console.error('❌ Failed to send email:', error);
    
    if (error.message?.includes('Invalid API key')) {
      console.log('\n💡 Tip: Check if RESEND_API_KEY is correct in .env file');
    }
    
    if (error.message?.includes('not verified')) {
      console.log('\n💡 Tip: Make sure the domain is verified in Resend dashboard');
    }
  }
}

testResendDirectly()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });