const fetch = require('node-fetch');

async function testSlotsAPI() {
  try {
    console.log('🔍 Testing slots API...\n');
    
    // Test met vandaag (2025-08-14)
    const today = '2025-08-14';
    console.log(`Testing date: ${today}`);
    
    const response = await fetch(`http://localhost:3001/api/v2/appointments/slots?date=${today}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success!');
      console.log(`📅 Date: ${data.date}`);
      console.log(`📊 Total slots: ${data.totalSlots}`);
      console.log(`✅ Available slots: ${data.availableSlots}`);
      console.log('\n🕐 Time slots:');
      data.slots.forEach(slot => {
        console.log(`   ${slot.time} - ${slot.isAvailable ? '✅' : '❌'}`);
      });
    } else {
      const error = await response.text();
      console.log('❌ Error:');
      console.log(error);
    }
    
  } catch (error) {
    console.error('💥 Connection error:', error.message);
    console.log('\n💡 Make sure the API server is running on port 3001');
  }
}

testSlotsAPI();
