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

async function updateSlotDuration() {
  const client = await pool.connect();
  
  try {
    console.log('⏰ Updating appointment duration from 60 to 30 minutes...\n');
    
    // Clear existing slots first
    await client.query('DELETE FROM appointment_time_slots');
    console.log('🗑️  Cleared existing time slots');
    
    // Define new 30-minute time slots (Monday-Friday, 9 AM to 5 PM, with lunch break)
    const timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',  // Morning
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'  // Afternoon (lunch break 12:00-13:00)
    ];
    
    console.log('📅 Adding 30-minute time slots for Monday-Friday:');
    console.log('   Morning: 09:00-12:00 (30-min slots)');
    console.log('   Lunch break: 12:00-13:00');
    console.log('   Afternoon: 13:00-17:00 (30-min slots)\n');
    
    let totalAdded = 0;
    
    for (let day = 1; day <= 5; day++) { // Monday (1) to Friday (5)
      const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      console.log(`   ${dayNames[day]}:`);
      
      for (const time of timeSlots) {
        const [hours, minutes] = time.split(':').map(Number);
        const endMinutes = minutes + 30;
        const endHours = endMinutes >= 60 ? hours + 1 : hours;
        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;
        
        await client.query(`
          INSERT INTO appointment_time_slots (day_of_week, start_time, end_time, duration_minutes, is_available)
          VALUES ($1, $2, $3, 30, true)
        `, [day, time, endTime]);
        
        console.log(`     ${time} - ${endTime} ✅`);
        totalAdded++;
      }
    }
    
    console.log(`\n✅ Added ${totalAdded} time slots (30 minutes each)!`);
    
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
      console.log(`   ${dayNames[row.day_of_week]}: ${row.slot_count} slots (30-min each)`);
    });
    
    console.log('\n🎉 Duration updated to 30 minutes!');
    console.log('=====================================');
    console.log('✅ Monday-Friday: 14 slots each day');
    console.log('✅ Duration: 30 minutes per appointment');
    console.log('✅ Business hours: 9 AM - 5 PM');
    console.log('✅ Lunch break: 12 PM - 1 PM (no appointments)');
    console.log('✅ More availability with shorter slots!');
    
  } catch (error) {
    console.error('❌ Error updating time slots:', error);
    throw error;
  } finally {
    client.release();
  }
}

updateSlotDuration()
  .then(() => {
    console.log('\n✨ 30-minute appointments are now ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to update time slots:', error.message);
    process.exit(1);
  })
  .finally(() => pool.end());
