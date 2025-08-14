const fetch = require('node-fetch');

async function testAvailableDates() {
  try {
    console.log('🗓️  Testing available dates API...\n');
    
    // Test voor augustus 2025
    const year = 2025;
    const month = 8;
    
    console.log(`Testing for ${year}-${month.toString().padStart(2, '0')}`);
    
    const response = await fetch(`http://localhost:3001/api/v2/appointments/available-dates?year=${year}&month=${month}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success!');
      console.log(`📅 Year: ${data.year}`);
      console.log(`📅 Month: ${data.month}`);
      console.log(`📊 Available dates count: ${data.count}`);
      console.log('\n📅 Available dates:');
      data.availableDates.forEach(date => {
        const dateObj = new Date(date);
        const dayName = dateObj.toLocaleDateString('nl-NL', { weekday: 'long' });
        console.log(`   ${date} (${dayName})`);
      });
    } else {
      const error = await response.text();
      console.log('❌ Error:');
      console.log(error);
    }
    
    // Test slots voor een specifieke datum
    console.log('\n\n🕐 Testing slots for a specific date...');
    const testDate = '2025-08-15'; // Tomorrow
    
    const slotsResponse = await fetch(`http://localhost:3001/api/v2/appointments/slots?date=${testDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (slotsResponse.ok) {
      const slotsData = await slotsResponse.json();
      console.log(`✅ Slots for ${testDate}:`);
      console.log(`📊 Total slots: ${slotsData.totalSlots}`);
      console.log(`✅ Available slots: ${slotsData.availableSlots}`);
      
      if (slotsData.availableSlots === 0) {
        console.log('🚫 This date is FULLY BOOKED - should not appear in available dates');
      } else {
        console.log('✅ This date has available slots - should appear in available dates');
      }
    } else {
      console.log(`❌ Error getting slots for ${testDate}`);
    }
    
  } catch (error) {
    console.error('💥 Connection error:', error.message);
    console.log('\n💡 Make sure the API server is running on port 3001');
  }
}

testAvailableDates();
