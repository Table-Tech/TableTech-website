async function testFrontendRealTimeUpdates() {
  console.log('🖥️ Testing Frontend Real-Time Slot Updates');
  console.log('==========================================\n');

  const testDate = '2025-08-21'; // Thursday
  
  // Step 1: Get slots for frontend simulation
  console.log('1️⃣ Getting slots as frontend would...');
  const slotsResponse = await fetch(`http://localhost:3001/api/v2/appointments/slots?date=${testDate}`, {
    headers: { 'Origin': 'http://localhost:5174' }
  });
  const slotsData = await slotsResponse.json();
  
  console.log(`📅 Date: ${testDate}`);
  console.log(`🎯 Total slots: ${slotsData.totalSlots}`);
  console.log(`✅ Available slots: ${slotsData.availableSlots}`);
  
  if (slotsData.availableSlots === 0) {
    console.log('❌ No slots available for testing. Try another date.');
    return;
  }
  
  // Show slot status like frontend would
  console.log('\n📋 Slot Status (as frontend shows):');
  slotsData.slots.forEach(slot => {
    const status = slot.isAvailable ? '✅ Available' : '❌ Bezet (crossed out)';
    console.log(`   ${slot.time}: ${status}`);
  });
  
  // Find first available slot
  const availableSlot = slotsData.slots.find(slot => slot.isAvailable);
  console.log(`\n🎯 Will book slot: ${availableSlot.time}`);
  
  // Step 2: Simulate booking (like frontend form submission)
  console.log('\n2️⃣ Simulating frontend booking submission...');
  const formData = {
    restaurantName: "Frontend Test Restaurant",
    contactPerson: "Frontend User",
    email: "frontend@example.com",
    phone: "+31612345678",
    date: testDate,
    time: availableSlot.time,
    message: "Test booking via simulated frontend form",
    formRenderTs: Date.now() - 4000,
    hp: ""
  };
  
  // Add idempotency header like frontend does
  const bookingResponse = await fetch('http://localhost:3001/api/v2/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Idempotency-Key': `frontend-${Date.now()}-${Math.random()}`,
      'Origin': 'http://localhost:5174'
    },
    body: JSON.stringify(formData)
  });
  
  const bookingResult = await bookingResponse.json();
  
  if (bookingResult.success) {
    console.log(`✅ Booking successful via frontend simulation!`);
    console.log(`🎫 Reference: ${bookingResult.referenceNumber}`);
    console.log(`📧 Emails: ${bookingResult.emailConfirmation.message}`);
  } else {
    console.log('❌ Booking failed:', bookingResult.error);
    return;
  }
  
  // Step 3: Check updated slots (as next user would see)
  console.log('\n3️⃣ Getting updated slots (as next visitor would see)...');
  const updatedSlotsResponse = await fetch(`http://localhost:3001/api/v2/appointments/slots?date=${testDate}`, {
    headers: { 'Origin': 'http://localhost:5174' }
  });
  const updatedSlots = await updatedSlotsResponse.json();
  
  console.log('\n📋 Updated Slot Status (next visitor sees):');
  updatedSlots.slots.forEach(slot => {
    const wasJustBooked = slot.time === availableSlot.time;
    let status;
    if (slot.isAvailable) {
      status = '✅ Available (clickable)';
    } else {
      status = wasJustBooked 
        ? '❌ Bezet (JUST BOOKED - crossed out with red line)' 
        : '❌ Bezet (crossed out)';
    }
    console.log(`   ${slot.time}: ${status}`);
  });
  
  // Step 4: Verify the specific slot is blocked
  const bookedSlot = updatedSlots.slots.find(slot => slot.time === availableSlot.time);
  
  console.log('\n📊 FRONTEND VERIFICATION:');
  console.log(`   Original available slots: ${slotsData.availableSlots}`);
  console.log(`   After booking: ${updatedSlots.availableSlots}`);
  console.log(`   Slot ${availableSlot.time} is now: ${bookedSlot.isAvailable ? 'STILL AVAILABLE ❌' : 'BLOCKED ✅'}`);
  
  if (!bookedSlot.isAvailable) {
    console.log('\n🎉 SUCCESS! Real-time frontend updates working perfectly!');
    console.log('👤 Next visitor will see:');
    console.log(`   ▫️ Slot ${availableSlot.time} is grayed out`);
    console.log(`   ▫️ Red line through the time`);
    console.log(`   ▫️ Red dot indicator`);
    console.log(`   ▫️ "Bezet" tooltip on hover`);
    console.log(`   ▫️ Cannot click to select it`);
  } else {
    console.log('\n❌ PROBLEM! Slot is still showing as available');
  }
  
  // Step 5: Test the error when someone tries to book same slot
  console.log('\n4️⃣ Testing conflict prevention...');
  const conflictResponse = await fetch('http://localhost:3001/api/v2/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Idempotency-Key': `conflict-test-${Date.now()}`,
      'Origin': 'http://localhost:5174'
    },
    body: JSON.stringify({
      ...formData,
      contactPerson: "Conflicting User",
      email: "conflict@example.com"
    })
  });
  
  const conflictResult = await conflictResponse.json();
  
  if (!conflictResult.success && conflictResult.error?.includes('no longer available')) {
    console.log('✅ Conflict prevention working!');
    console.log('💬 User would see: "This time slot is no longer available. Please select another time."');
  } else {
    console.log('❌ Conflict prevention failed!');
  }
}

testFrontendRealTimeUpdates();
