#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

async function addDefaultTimeSlots() {
  const client = await pool.connect();
  
  try {
    console.log('⏰ Adding default time slots...\n');
    
    // Check current time slots
    const currentCount = await client.query('SELECT COUNT(*) as count FROM appointment_time_slots');
    console.log(`Current time slots: ${currentCount.rows[0].count}`);
    
    if (currentCount.rows[0].count > 0) {
      console.log('⚠️  Time slots already exist. Skipping...');
      return;
    }
    
    // Define default time slots (Monday-Friday, 9 AM to 5 PM, lunch break 12-1 PM)
    const timeSlots = [];
    const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    
    console.log('📅 Adding time slots for Monday-Friday:');
    console.log('   Times: 09:00-11:00, 13:00-16:00 (lunch break 12:00-13:00)');
    
    for (let day = 1; day <= 5; day++) { // Monday (1) to Friday (5)
      const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      console.log(`\n   ${dayNames[day]}:`);
      
      for (const time of times) {
        const endTime = time === '16:00' ? '17:00' : 
                       time === '11:00' ? '12:00' : 
                       String(parseInt(time.split(':')[0]) + 1).padStart(2, '0') + ':00';
        
        await client.query(`
          INSERT INTO appointment_time_slots (day_of_week, start_time, end_time, duration_minutes, is_available)
          VALUES ($1, $2, $3, 60, true)
        `, [day, time, endTime]);
        
        console.log(`     ${time} - ${endTime} ✅`);
      }
    }
    
    // Verify insertion
    const finalCount = await client.query('SELECT COUNT(*) as count FROM appointment_time_slots');
    console.log(`\n✅ Added ${finalCount.rows[0].count} time slots successfully!`);
    
    // Show summary by day
    console.log('\n📊 Time slots summary:');
    const summary = await client.query(`
      SELECT day_of_week, COUNT(*) as slot_count
      FROM appointment_time_slots
      GROUP BY day_of_week
      ORDER BY day_of_week
    `);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    summary.rows.forEach(row => {
      console.log(`   ${dayNames[row.day_of_week]}: ${row.slot_count} slots`);
    });
    
    console.log('\n🎉 Default time slots configured!');
    console.log('=================================');
    console.log('✅ Monday-Friday: 7 slots each day');
    console.log('✅ Business hours: 9 AM - 5 PM');
    console.log('✅ Lunch break: 12 PM - 1 PM (no appointments)');
    console.log('✅ Weekend: No appointments available');
    
  } catch (error) {
    console.error('❌ Error adding time slots:', error);
    throw error;
  } finally {
    client.release();
  }
}

addDefaultTimeSlots()
  .then(() => {
    console.log('\n✨ Time slots are ready for appointments!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to add time slots:', error.message);
    process.exit(1);
  })
  .finally(() => pool.end());