#!/usr/bin/env node

const axios = require('axios');

async function testFrontendAppointmentFlow() {
  console.log('🧪 Testing Frontend → V2 API appointment flow...\n');
  
  try {
    // Step 1: Get available slots for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    
    console.log(`📅 Step 1: Getting available slots for ${dateString}...`);
    
    const slotsResponse = await axios.get(`http://localhost:3001/api/v2/appointments/slots?date=${dateString}`, {
      timeout: 10000
    });
    
    console.log('✅ Available slots response:', {
      success: slotsResponse.data.success,
      totalSlots: slotsResponse.data.totalSlots,
      availableSlots: slotsResponse.data.availableSlots
    });
    
    // Find first available slot
    const availableSlot = slotsResponse.data.slots.find(slot => slot.isAvailable);
    
    if (!availableSlot) {
      console.log('❌ No available slots found for testing');
      return;
    }
    
    console.log(`✅ Using slot: ${availableSlot.time}\n`);
    
    // Step 2: Create appointment with V2 data format (matching frontend)
    console.log('📝 Step 2: Creating appointment via V2 API...');
    
    const appointmentData = {
      restaurantName: "Frontend Test Restaurant",
      contactPerson: "Jane Frontend", 
      email: "frontend@test.com",
      phone: "+31612345679",
      date: dateString,
      time: availableSlot.time,
      message: "Test appointment from frontend simulation"
    };
    
    const appointmentResponse = await axios.post('http://localhost:3001/api/v2/appointments', appointmentData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `frontend-test-${Date.now()}`
      },
      timeout: 30000
    });
    
    console.log('✅ Appointment created successfully!');
    console.log('Response:', {
      success: appointmentResponse.data.success,
      referenceNumber: appointmentResponse.data.referenceNumber,
      emailsSent: appointmentResponse.data.emailConfirmation.sent,
      customerEmail: appointmentResponse.data.emailConfirmation.customer,
      internalEmail: appointmentResponse.data.emailConfirmation.internal
    });
    
    // Step 3: Verify slot is now blocked
    console.log('\n🔒 Step 3: Verifying slot is now blocked...');
    
    const updatedSlotsResponse = await axios.get(`http://localhost:3001/api/v2/appointments/slots?date=${dateString}`, {
      timeout: 10000
    });
    
    const updatedSlot = updatedSlotsResponse.data.slots.find(slot => slot.time === availableSlot.time);
    
    if (updatedSlot && !updatedSlot.isAvailable) {
      console.log(`✅ Slot ${availableSlot.time} is now correctly blocked!`);
    } else {
      console.log(`❌ Slot ${availableSlot.time} should be blocked but is still available`);
    }
    
    console.log('\nSlots status:', {
      beforeBooking: slotsResponse.data.availableSlots,
      afterBooking: updatedSlotsResponse.data.availableSlots,
      difference: slotsResponse.data.availableSlots - updatedSlotsResponse.data.availableSlots
    });
    
    console.log('\n🎉 Frontend appointment flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Frontend flow test failed:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testFrontendAppointmentFlow()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });