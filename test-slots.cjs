async function getAvailableSlots() {
  try {
    console.log('🔍 Getting available slots for 2025-08-18...');
    
    const response = await fetch('http://localhost:3001/api/v2/appointments/slots?date=2025-08-18', {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5174'
      }
    });
    
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Available Slots:', JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('💥 Failed to get slots:', error.message);
  }
}

getAvailableSlots();
