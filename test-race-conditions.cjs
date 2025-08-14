async function simulateMultipleUsers() {
  console.log('👥 Simulating Multiple Users Booking Same Slot');
  console.log('==============================================\n');

  const testDate = '2025-08-22'; // Friday
  
  // Get available slots
  const slotsResponse = await fetch(`http://localhost:3001/api/v2/appointments/slots?date=${testDate}`);
  const slotsData = await slotsResponse.json();
  
  if (slotsData.availableSlots === 0) {
    console.log('❌ No slots available for testing');
    return;
  }
  
  const targetSlot = slotsData.slots.find(slot => slot.isAvailable);
  console.log(`🎯 Target slot: ${targetSlot.time} on ${testDate}`);
  console.log(`📊 Available slots: ${slotsData.availableSlots}\n`);
  
  // Create booking data for multiple users
  const users = [
    {
      name: "User A - First",
      data: {
        restaurantName: "Restaurant A",
        contactPerson: "John Smith", 
        email: "john@restaurant-a.com",
        phone: "+31612345001",
        date: testDate,
        time: targetSlot.time,
        message: "First user trying to book",
        formRenderTs: Date.now() - 5000,
        hp: ""
      }
    },
    {
      name: "User B - Second", 
      data: {
        restaurantName: "Restaurant B",
        contactPerson: "Jane Doe",
        email: "jane@restaurant-b.com", 
        phone: "+31612345002",
        date: testDate,
        time: targetSlot.time,
        message: "Second user trying to book same slot",
        formRenderTs: Date.now() - 4000,
        hp: ""
      }
    },
    {
      name: "User C - Third",
      data: {
        restaurantName: "Restaurant C", 
        contactPerson: "Bob Wilson",
        email: "bob@restaurant-c.com",
        phone: "+31612345003", 
        date: testDate,
        time: targetSlot.time,
        message: "Third user also wants this slot",
        formRenderTs: Date.now() - 3000,
        hp: ""
      }
    }
  ];
  
  console.log('🏃‍♂️ Simulating concurrent booking attempts...\n');
  
  // Try to book simultaneously (within milliseconds of each other)
  const bookingPromises = users.map((user, index) => {
    return new Promise(async (resolve) => {
      // Slight delay to simulate real network conditions
      setTimeout(async () => {
        try {
          const response = await fetch('http://localhost:3001/api/v2/appointments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Idempotency-Key': `user-${index}-${Date.now()}-${Math.random()}`,
              'Origin': 'http://localhost:5174'
            },
            body: JSON.stringify(user.data)
          });
          
          const result = await response.json();
          resolve({
            user: user.name,
            success: result.success,
            reference: result.referenceNumber,
            error: result.error,
            code: result.code
          });
        } catch (error) {
          resolve({
            user: user.name,
            success: false,
            error: error.message,
            code: 'NETWORK_ERROR'
          });
        }
      }, index * 50); // 50ms apart to simulate near-simultaneous attempts
    });
  });
  
  // Wait for all booking attempts
  const results = await Promise.all(bookingPromises);
  
  // Analyze results
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log('📊 BOOKING RESULTS:');
  console.log('==================');
  
  results.forEach((result, index) => {
    if (result.success) {
      console.log(`${index + 1}. ✅ ${result.user}: SUCCESS - Ref: ${result.reference}`);
    } else {
      console.log(`${index + 1}. ❌ ${result.user}: FAILED - ${result.error}`);
    }
  });
  
  console.log('\n📈 ANALYSIS:');
  console.log(`   ✅ Successful bookings: ${successful.length}`);
  console.log(`   ❌ Failed bookings: ${failed.length}`);
  
  if (successful.length === 1 && failed.length === 2) {
    console.log('\n🎉 PERFECT! Race condition protection working correctly!');
    console.log('   ▫️ Only ONE user got the slot');
    console.log('   ▫️ Other users were properly rejected');
    console.log('   ▫️ No double-booking occurred');
    
    // Check if failed bookings got proper error messages
    const slotUnavailableErrors = failed.filter(f => 
      f.error?.includes('no longer available') || 
      f.code === 'SLOT_UNAVAILABLE'
    );
    
    if (slotUnavailableErrors.length === failed.length) {
      console.log('   ▫️ Failed users got correct "slot unavailable" message');
    }
    
  } else if (successful.length > 1) {
    console.log('\n❌ PROBLEM! Multiple users booked the same slot!');
    console.log('   🚨 Double-booking occurred - this needs fixing');
  } else if (successful.length === 0) {
    console.log('\n❌ PROBLEM! No bookings succeeded');
    console.log('   🚨 System might be too restrictive');
  }
  
  // Verify final slot status
  console.log('\n4️⃣ Checking final slot status...');
  const finalSlotsResponse = await fetch(`http://localhost:3001/api/v2/appointments/slots?date=${testDate}`);
  const finalSlots = await finalSlotsResponse.json();
  const finalTargetSlot = finalSlots.slots.find(slot => slot.time === targetSlot.time);
  
  console.log(`   Slot ${targetSlot.time} is now: ${finalTargetSlot.isAvailable ? 'AVAILABLE ❌' : 'BLOCKED ✅'}`);
  console.log(`   Available slots: ${slotsData.availableSlots} → ${finalSlots.availableSlots}`);
  
  if (!finalTargetSlot.isAvailable && successful.length === 1) {
    console.log('\n🏆 EXCELLENT! Database consistency maintained!');
  }
}

simulateMultipleUsers();
