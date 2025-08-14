#!/usr/bin/env node

require('dotenv').config();
const { Resend } = require('resend');

async function diagnoseEmailIssue() {
  console.log('🔍 DIAGNOSING EMAIL DELIVERY ISSUE');
  console.log('==================================\n');
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Check API key
  console.log('1. 🔑 API Key Configuration:');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET (***' + process.env.RESEND_API_KEY.slice(-6) + ')' : '❌ NOT SET');
  console.log('MAIL_FROM:', process.env.MAIL_FROM);
  console.log('MAIL_TO_INTERNAL:', process.env.MAIL_TO_INTERNAL);
  
  try {
    // Test 1: Direct email with Resend's onboarding domain
    console.log('\n2. 🧪 Testing with Resend onboarding domain...');
    
    const onboardingTest = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'info@tabletech.nl',
      subject: 'TableTech Email Test - Onboarding Domain',
      html: '<h1>Test Email</h1><p>This is a test from Resend onboarding domain.</p>',
      text: 'Test Email\n\nThis is a test from Resend onboarding domain.'
    });
    
    console.log('✅ Onboarding domain result:', {
      success: !!onboardingTest.data?.id,
      messageId: onboardingTest.data?.id,
      error: onboardingTest.error?.message
    });
    
    // Test 2: Direct email with configured domain
    console.log('\n3. 🧪 Testing with configured domain...');
    
    const configuredTest = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: 'info@tabletech.nl',
      subject: 'TableTech Email Test - Configured Domain',
      html: '<h1>Test Email</h1><p>This is a test from configured domain.</p>',
      text: 'Test Email\n\nThis is a test from configured domain.'
    });
    
    console.log('Result:', {
      success: !!configuredTest.data?.id,
      messageId: configuredTest.data?.id,
      error: configuredTest.error?.message
    });
    
    // Test 3: Check domain verification (if API supports it)
    console.log('\n4. 🔍 Domain Analysis:');
    const fromEmail = process.env.MAIL_FROM;
    const domain = fromEmail.includes('<') ? 
      fromEmail.split('<')[1].split('>')[0].split('@')[1] : 
      fromEmail.split('@')[1];
    console.log('Extracted domain:', domain);
    
    if (domain === 'tabletech.nl') {
      console.log('⚠️  Using custom domain "tabletech.nl"');
      console.log('   This domain needs to be verified in Resend dashboard');
      console.log('   Steps to verify:');
      console.log('   1. Go to https://resend.com/domains');
      console.log('   2. Add "tabletech.nl" domain');
      console.log('   3. Add required DNS records');
      console.log('   4. Wait for verification');
    }
    
    // Test 4: Test to a different email (customer)
    console.log('\n5. 🧪 Testing customer email delivery...');
    
    const customerTest = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use verified domain
      to: 'test-customer@example.com', // Change this to a real email you can check
      subject: 'TableTech Customer Email Test',
      html: '<h1>Customer Test</h1><p>This is a customer email test.</p>',
      text: 'Customer Test\n\nThis is a customer email test.'
    });
    
    console.log('Customer email result:', {
      success: !!customerTest.data?.id,
      messageId: customerTest.data?.id,
      error: customerTest.error?.message
    });
    
    // Recommendations
    console.log('\n6. 🎯 RECOMMENDATIONS:');
    
    if (domain === 'tabletech.nl') {
      console.log('❌ ISSUE FOUND: Custom domain not verified');
      console.log('   SOLUTION: Use onboarding@resend.dev temporarily');
      console.log('   OR verify tabletech.nl domain in Resend dashboard');
    }
    
    console.log('\n7. 📝 IMMEDIATE FIX:');
    console.log('Update .env file:');
    console.log('MAIL_FROM="TableTech Team <onboarding@resend.dev>"');
    console.log('This will ensure immediate email delivery while you verify the domain');
    
  } catch (error) {
    console.error('\n❌ Diagnosis failed:', error.message);
    console.log('Full error:', error);
  }
}

diagnoseEmailIssue()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });