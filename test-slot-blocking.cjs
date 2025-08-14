async function testRealTimeSlotBlocking() {
  console.log('🔄 Testing Real-Time Slot Blocking System');
  console.log('==========================================\n');

  const testDate = '2025-08-20'; // Wednesday
  
  // Step 1: Check initial slots
  console.log('1️⃣ Checking initial available slots...');
  const initialSlotsResponse = await fetch(`http://localhost:3001/api/v2/appointments/slots?date=${testDate}`);
  const initialSlots = await initialSlotsResponse.json();
  
  console.log(`📅 Date: ${testDate}`);
  console.log(`🎯 Total slots: ${initialSlots.totalSlots}`);
  console.log(`✅ Available slots: ${initialSlots.availableSlots}`);
  
  if (initialSlots.availableSlots === 0) {
    console.log('❌ No slots available for testing. Try another date.');
    return;
  }
  
  // Find first available slot
  const availableSlot = initialSlots.slots.find(slot => slot.isAvailable);
  console.log(`🎯 Testing with slot: ${availableSlot.time}\n`);
  
  // Step 2: Book the slot
  console.log('2️⃣ Booking the slot...');
  const bookingData = {
    restaurantName: "Real-Time Test Restaurant",
    contactPerson: "Slot Blocking Test",
    email: "slottest@example.com",
    phone: "+31612345678",
    date: testDate,
    time: availableSlot.time,
    message: "Testing real-time slot blocking functionality",
    formRenderTs: Date.now() - 3000,
    hp: ""
  };
  
  const bookingResponse = await fetch('http://localhost:3001/api/v2/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5174',
      'X-Idempotency-Key': `slot-test-${Date.now()}`
    },
    body: JSON.stringify(bookingData)
  });
  
  const bookingResult = await bookingResponse.json();
  
  if (bookingResult.success) {
    console.log(`✅ Slot ${availableSlot.time} successfully booked!`);
    console.log(`🎫 Reference: ${bookingResult.referenceNumber}\n`);
  } else {
    console.log('❌ Booking failed:', bookingResult.error);
    return;
  }
  
  // Step 3: Check slots again - the booked slot should now be unavailable
  console.log('3️⃣ Checking slots after booking (should show slot as booked)...');
  const updatedSlotsResponse = await fetch(`http://localhost:3001/api/v2/appointments/slots?date=${testDate}`);
  const updatedSlots = await updatedSlotsResponse.json();
  
  console.log(`✅ Available slots after booking: ${updatedSlots.availableSlots}`);
  
  // Find the slot we just booked
  const bookedSlot = updatedSlots.slots.find(slot => slot.time === availableSlot.time);
  
  if (bookedSlot && !bookedSlot.isAvailable) {
    console.log(`🎉 SUCCESS! Slot ${availableSlot.time} is now correctly marked as UNAVAILABLE`);
    console.log('✅ Real-time slot blocking is working perfectly!');
  } else {
    console.log(`❌ PROBLEM! Slot ${availableSlot.time} is still showing as available`);
    console.log('🚨 Real-time slot blocking is NOT working correctly');
  }
  
  // Step 4: Try to book the same slot again (should fail)
  console.log('\n4️⃣ Attempting to book the same slot again (should fail)...');
  const duplicateBookingResponse = await fetch('http://localhost:3001/api/v2/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5174',
      'X-Idempotency-Key': `duplicate-test-${Date.now()}`
    },
    body: JSON.stringify({
      ...bookingData,
      contactPerson: "Duplicate Booking Test",
      email: "duplicate@example.com"
    })
  });
  
  const duplicateResult = await duplicateBookingResponse.json();
  
  if (!duplicateResult.success && duplicateResult.code === 'SLOT_UNAVAILABLE') {
    console.log('✅ Duplicate booking correctly REJECTED!');
    console.log('✅ Slot protection is working perfectly!');
  } else {
    console.log('❌ PROBLEM! Duplicate booking was not rejected');
    console.log('🚨 Slot protection is NOT working correctly');
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`   Initial slots: ${initialSlots.availableSlots}`);
  console.log(`   After booking: ${updatedSlots.availableSlots}`);
  console.log(`   Slot ${availableSlot.time}: ${bookedSlot?.isAvailable ? 'STILL AVAILABLE ❌' : 'BLOCKED ✅'}`);
  console.log(`   Duplicate protection: ${!duplicateResult.success ? 'WORKING ✅' : 'BROKEN ❌'}`);
}

testRealTimeSlotBlocking();
