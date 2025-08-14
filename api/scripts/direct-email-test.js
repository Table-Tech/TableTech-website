#!/usr/bin/env node

require('dotenv').config();
const { Resend } = require('resend');

async function directEmailTest() {
  console.log('📧 DIRECT EMAIL DELIVERY TEST');
  console.log('=============================\n');
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  console.log('Configuration:');
  console.log('MAIL_FROM:', process.env.MAIL_FROM);
  console.log('MAIL_TO_INTERNAL:', process.env.MAIL_TO_INTERNAL);
  
  try {
    console.log('\n🧪 Test 1: Customer confirmation email...');
    
    const customerResult = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO_INTERNAL,
      subject: '🧪 TableTech Customer Email Test - VERIFICATIE',
      html: `
        <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a1a); padding: 40px; font-family: Arial, sans-serif;">
          <div style="background: #1a1a1a; border: 1px solid rgba(232, 108, 40, 0.3); border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
            
            <div style="background: linear-gradient(135deg, #E86C28, #FFB366); padding: 24px; border-radius: 12px; margin: -32px -32px 32px -32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">📧 Email Test Succesvol!</h1>
            </div>
            
            <h2 style="color: #FFB366; font-size: 22px;">Beste TableTech Team,</h2>
            
            <p style="color: #d1d5db; font-size: 16px; line-height: 24px;">
              Deze email bevestigt dat het TableTech email systeem <strong>correct werkt</strong> met de geverifieerde onboarding@resend.dev domein!
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(232, 108, 40, 0.2), rgba(255, 179, 102, 0.1)); border: 2px solid rgba(232, 108, 40, 0.4); border-radius: 12px; padding: 24px; margin: 24px 0;">
              <p style="color: white; font-size: 18px; margin: 0; text-align: center;">
                ✅ <strong>Email Delivery: OPERATIONAL</strong>
              </p>
            </div>
            
            <div style="background: rgba(232, 108, 40, 0.05); border: 1px solid rgba(232, 108, 40, 0.2); border-radius: 12px; padding: 24px; margin: 24px 0;">
              <h3 style="color: #FFB366; margin: 0 0 16px 0;">Test Details:</h3>
              <p style="color: #f3f4f6; font-size: 14px; margin: 0;"><strong>Tijd:</strong> ${new Date().toLocaleString('nl-NL')}</p>
              <p style="color: #f3f4f6; font-size: 14px; margin: 0;"><strong>Van:</strong> ${process.env.MAIL_FROM}</p>
              <p style="color: #f3f4f6; font-size: 14px; margin: 0;"><strong>Naar:</strong> ${process.env.MAIL_TO_INTERNAL}</p>
              <p style="color: #f3f4f6; font-size: 14px; margin: 0;"><strong>Status:</strong> Professionele React templates actief</p>
            </div>
            
            <div style="text-align: center; padding: 24px 0;">
              <a href="https://tabletech.nl" style="background: linear-gradient(135deg, #E86C28, #FFB366); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 12px rgba(232, 108, 40, 0.3);">
                Ga naar TableTech
              </a>
            </div>
            
            <div style="text-align: center; padding: 24px; background: rgba(232, 108, 40, 0.05); border-radius: 12px; margin: 24px -32px -32px -32px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                TableTech | Biezelingeplein 32, 3086 SB Rotterdam, Nederland
              </p>
              <p style="color: #FFB366; font-size: 12px; margin: 4px 0 0 0;">
                https://tabletech.nl
              </p>
            </div>
            
          </div>
        </div>
      `,
      text: `
TableTech Email Test

Deze email bevestigt dat het TableTech email systeem correct werkt!

✅ Email Delivery: OPERATIONAL

Test Details:
- Tijd: ${new Date().toLocaleString('nl-NL')}
- Van: ${process.env.MAIL_FROM}
- Naar: ${process.env.MAIL_TO_INTERNAL}
- Status: Professionele React templates actief

TableTech | https://tabletech.nl
      `.trim()
    });
    
    console.log('Customer email result:', {
      success: !!customerResult.data?.id,
      messageId: customerResult.data?.id,
      error: customerResult.error?.message
    });
    
    if (customerResult.data?.id) {
      console.log('✅ CUSTOMER EMAIL SENT! Message ID:', customerResult.data.id);
    }
    
    console.log('\n🧪 Test 2: Internal notification email...');
    
    const internalResult = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO_INTERNAL,
      subject: '🔥 TableTech Internal Email Test - VERIFICATIE',
      html: `
        <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a1a); padding: 40px; font-family: Arial, sans-serif;">
          <div style="background: #1a1a1a; border: 1px solid rgba(232, 108, 40, 0.3); border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto;">
            
            <div style="background: linear-gradient(135deg, #E86C28, #FFB366); padding: 40px; border-radius: 12px; margin: -32px -32px 32px -32px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔔 Internal Email Test</h1>
            </div>
            
            <h2 style="color: #FFB366; font-size: 20px;">Internal Notification System</h2>
            
            <div style="border-bottom: 1px solid rgba(232, 108, 40, 0.2); padding: 32px 24px; margin-bottom: 24px;">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #9ca3af; font-size: 14px; padding: 12px 32px 12px 16px; width: 160px;">Test Type:</td>
                  <td style="color: #f3f4f6; font-size: 14px; padding: 12px 16px 12px 24px;">Internal Notification</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; font-size: 14px; padding: 12px 32px 12px 16px;">Timestamp:</td>
                  <td style="color: #f3f4f6; font-size: 14px; padding: 12px 16px 12px 24px;">${new Date().toLocaleString('nl-NL')}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; font-size: 14px; padding: 12px 32px 12px 16px;">From Domain:</td>
                  <td style="color: #f3f4f6; font-size: 14px; padding: 12px 16px 12px 24px;">${process.env.MAIL_FROM}</td>
                </tr>
                <tr>
                  <td style="color: #9ca3af; font-size: 14px; padding: 12px 32px 12px 16px;">Status:</td>
                  <td style="color: #f3f4f6; font-size: 14px; padding: 12px 16px 12px 24px;"><span style="color: #22c55e;">✅ OPERATIONAL</span></td>
                </tr>
              </table>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(232, 108, 40, 0.2), rgba(255, 179, 102, 0.2)); border-radius: 12px; padding: 32px; margin: 32px -32px -32px -32px; border-top: 2px solid #E86C28;">
              <p style="color: #FFB366; font-size: 14px; margin: 0; font-weight: 600;">
                ⚡ <strong>TEST RESULT:</strong> Internal email system is fully operational!
              </p>
            </div>
            
          </div>
        </div>
      `,
      text: `
🔔 TABLETECH INTERNAL EMAIL TEST
================================

Internal Notification System Test

📋 TEST DETAILS:
- Test Type: Internal Notification
- Timestamp: ${new Date().toLocaleString('nl-NL')}
- From Domain: ${process.env.MAIL_FROM}
- Status: ✅ OPERATIONAL

⚡ TEST RESULT: Internal email system is fully operational!
      `.trim()
    });
    
    console.log('Internal email result:', {
      success: !!internalResult.data?.id,
      messageId: internalResult.data?.id,
      error: internalResult.error?.message
    });
    
    if (internalResult.data?.id) {
      console.log('✅ INTERNAL EMAIL SENT! Message ID:', internalResult.data.id);
    }
    
    // Summary
    console.log('\n🎉 EMAIL TEST SUMMARY:');
    console.log('======================');
    const customerSuccess = !!customerResult.data?.id;
    const internalSuccess = !!internalResult.data?.id;
    
    console.log('Customer Email:', customerSuccess ? '✅ SENT' : '❌ FAILED');
    console.log('Internal Email:', internalSuccess ? '✅ SENT' : '❌ FAILED');
    console.log('Overall Status:', (customerSuccess && internalSuccess) ? '✅ SUCCESS' : '❌ PARTIAL/FAILED');
    
    if (customerSuccess && internalSuccess) {
      console.log('\n🎯 EMAILS SHOULD ARRIVE AT: info@tabletech.nl');
      console.log('📧 Check your inbox within 1-2 minutes');
      console.log('📧 Look for emails from: TableTech Team <onboarding@resend.dev>');
      console.log('📧 Subjects: "🧪 TableTech Customer Email Test" and "🔥 TableTech Internal Email Test"');
    }
    
  } catch (error) {
    console.error('\n❌ Direct email test failed:', error.message);
    console.log('Full error:', error);
  }
}

directEmailTest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });