#!/usr/bin/env node

const axios = require('axios');

async function testRealEmailDelivery() {
  console.log('📧 TESTING REAL EMAIL DELIVERY');
  console.log('==============================\n');
  
  try {
    // Step 1: Get available slots
    console.log('1. 📅 Getting available slots...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    
    const slotsResponse = await axios.get(`http://localhost:3001/api/v2/appointments/slots?date=${dateString}`);
    const availableSlot = slotsResponse.data.slots.find(slot => slot.isAvailable);
    
    if (!availableSlot) {
      console.log('⚠️  No available slots for testing');
      return;
    }
    
    console.log(`✅ Found available slot: ${availableSlot.time}`);
    
    // Step 2: Create appointment with REAL email addresses
    console.log('\n2. 📬 Creating appointment with verified domain...');
    
    const realTestData = {
      restaurantName: "REAL EMAIL TEST Restaurant",
      contactPerson: "Email Delivery Test",
      email: "info@tabletech.nl", // This should arrive!
      phone: "+31612345000",
      date: dateString,
      time: availableSlot.time,
      message: "🧪 TESTING REAL EMAIL DELIVERY with verified onboarding@resend.dev domain. If you see this email, the system is working!"
    };
    
    console.log(`📧 Test emails will be sent to: ${realTestData.email}`);
    console.log(`📧 Internal email will be sent to: info@tabletech.nl`);
    console.log(`🕐 Appointment time: ${availableSlot.time}`);
    
    const appointmentResponse = await axios.post('http://localhost:3001/api/v2/appointments', realTestData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `real-email-test-${Date.now()}`
      },
      timeout: 30000
    });
    
    console.log('\n3. ✅ APPOINTMENT CREATED!');
    console.log('Reference Number:', appointmentResponse.data.referenceNumber);
    console.log('Customer Email Sent:', appointmentResponse.data.emailConfirmation.customer ? '✅ YES' : '❌ NO');
    console.log('Internal Email Sent:', appointmentResponse.data.emailConfirmation.internal ? '✅ YES' : '❌ NO');
    console.log('Overall Status:', appointmentResponse.data.emailConfirmation.sent ? '✅ SUCCESS' : '❌ FAILED');
    
    console.log('\n4. 📧 EMAIL DELIVERY EXPECTATIONS:');
    console.log('==================================');
    console.log(`📨 CHECK YOUR INBOX: info@tabletech.nl`);
    console.log(`📨 You should receive 2 emails:`);
    console.log(`   1. Customer confirmation email (beautiful orange design)`);
    console.log(`   2. Internal notification email (detailed booking info)`);
    console.log(`📨 Both from: "TableTech Team <onboarding@resend.dev>"`);
    console.log(`📨 Subject lines should contain: "${appointmentResponse.data.referenceNumber}"`);
    
    if (appointmentResponse.data.emailConfirmation.sent) {
      console.log('\n🎉 SUCCESS! Emails should arrive within 1-2 minutes');
      console.log('   If emails don\'t arrive, check spam folder');
      console.log('   Sender: TableTech Team <onboarding@resend.dev>');
    } else {
      console.log('\n❌ FAILED! Emails were not sent successfully');
    }
    
  } catch (error) {
    console.error('\n❌ Real email test failed:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testRealEmailDelivery()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });