// Test timezone issue fix
function testDateFormatting() {
  // Test the old problematic way
  const date = new Date(2025, 7, 15); // August 15, 2025 (month is 0-indexed)
  console.log('Original date:', date);
  console.log('Date.toString():', date.toString());
  
  // Old problematic way (timezone dependent)
  const oldWay = date.toISOString().split('T')[0];
  console.log('Old way (toISOString):', oldWay);
  
  // New correct way (timezone safe)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const newWay = `${year}-${month}-${day}`;
  console.log('New way (timezone safe):', newWay);
  
  console.log('Are they the same?', oldWay === newWay);
}

testDateFormatting();
