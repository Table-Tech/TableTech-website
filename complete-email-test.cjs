async function completeEmailTest() {
  try {
    console.log('🎯 Complete end-to-end email test...');
    
    // First get available slots for a future date
    console.log('1️⃣ Finding available time slot...');
    
    const dateToTest = '2025-08-19'; // Tuesday
    
    const slotsResponse = await fetch(`http://localhost:3001/api/v2/appointments/slots?date=${dateToTest}`, {
      headers: { 'Origin': 'http://localhost:5174' }
    });
    
    const slotsData = await slotsResponse.json();
    console.log(`📅 Available slots for ${dateToTest}:`, slotsData.availableSlots);
    
    // Find first available slot
    const availableSlot = slotsData.slots?.find(slot => slot.isAvailable);
    
    if (!availableSlot) {
      console.log('❌ No available slots found. Let\'s try another date...');
      return;
    }
    
    console.log(`✅ Found available slot: ${availableSlot.time}`);
    
    // Now make a booking for both customer and business emails
    console.log('2️⃣ Creating appointment booking...');
    
    const bookingData = {
      restaurantName: "Email Test Restaurant",
      contactPerson: "Test Email User",
      email: "testklant@example.com", // This will receive customer confirmation
      phone: "+31612345678",
      date: dateToTest,
      time: availableSlot.time,
      message: "Dit is een test afspraak om email functionaliteit te verifiëren. Zowel de klant als info@tabletech.nl zouden emails moeten ontvangen.",
      formRenderTs: Date.now() - 5000,
      hp: ""
    };
    
    const bookingResponse = await fetch('http://localhost:3001/api/v2/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174',
        'X-Idempotency-Key': `test-${Date.now()}`
      },
      body: JSON.stringify(bookingData)
    });
    
    const bookingResult = await bookingResponse.json();
    
    console.log('📊 Booking Response Status:', bookingResponse.status);
    console.log('📋 Booking Result:', JSON.stringify(bookingResult, null, 2));
    
    if (bookingResult.success) {
      console.log('🎉 SUCCESS! Booking created successfully!');
      console.log('🎫 Reference Number:', bookingResult.referenceNumber);
      console.log('📧 Email Status:');
      console.log('   Customer email (testklant@example.com):', bookingResult.emailConfirmation.customer ? '✅ SENT' : '❌ FAILED');
      console.log('   Business email (info@tabletech.nl):', bookingResult.emailConfirmation.internal ? '✅ SENT' : '❌ FAILED');
      console.log('');
      console.log('🔍 Check your inbox at info@tabletech.nl for the business notification!');
      console.log('📄 Message:', bookingResult.emailConfirmation.message);
    } else {
      console.log('❌ Booking failed!');
      console.log('🚨 Error:', bookingResult.error);
    }
    
  } catch (error) {
    console.error('💥 Complete test failed:', error.message);
  }
}

completeEmailTest();
