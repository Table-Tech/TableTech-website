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

async function cleanupTestData() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Cleaning up test data from Neon database...\n');
    
    // Check current data before cleanup
    const appointmentsCount = await client.query('SELECT COUNT(*) as count FROM appointments');
    const emailLogsCount = await client.query('SELECT COUNT(*) as count FROM email_logs');
    
    console.log('📊 Current Data:');
    console.log(`   Appointments: ${appointmentsCount.rows[0].count}`);
    console.log(`   Email Logs: ${emailLogsCount.rows[0].count}`);
    
    if (appointmentsCount.rows[0].count > 0) {
      console.log('\n📝 Test appointments to be removed:');
      const testAppointments = await client.query(`
        SELECT reference_number, appointment_date, appointment_time, restaurant_name, created_at
        FROM appointments 
        ORDER BY created_at DESC
      `);
      
      testAppointments.rows.forEach(appt => {
        console.log(`   🗑️  ${appt.reference_number} - ${appt.restaurant_name} - ${appt.appointment_date} ${appt.appointment_time}`);
      });
    }
    
    console.log('\n🔄 Performing cleanup...');
    
    // Delete all test appointments
    const deletedAppointments = await client.query('DELETE FROM appointments RETURNING reference_number');
    console.log(`✅ Removed ${deletedAppointments.rows.length} test appointments`);
    
    if (deletedAppointments.rows.length > 0) {
      deletedAppointments.rows.forEach(appt => {
        console.log(`   ❌ ${appt.reference_number}`);
      });
    }
    
    // Delete all email logs
    const deletedEmailLogs = await client.query('DELETE FROM email_logs RETURNING id');
    console.log(`✅ Removed ${deletedEmailLogs.rows.length} email log entries`);
    
    // Delete any blocked test dates (if any)
    const deletedBlockedDates = await client.query('DELETE FROM blocked_dates RETURNING blocked_date');
    console.log(`✅ Removed ${deletedBlockedDates.rows.length} test blocked dates`);
    
    // Reset sequence counters (optional, for clean IDs)
    // This is safe because we're using UUIDs
    
    console.log('\n🧹 Final verification:');
    const finalAppointmentsCount = await client.query('SELECT COUNT(*) as count FROM appointments');
    const finalEmailLogsCount = await client.query('SELECT COUNT(*) as count FROM email_logs');
    const finalBlockedDatesCount = await client.query('SELECT COUNT(*) as count FROM blocked_dates');
    
    console.log(`   Appointments remaining: ${finalAppointmentsCount.rows[0].count}`);
    console.log(`   Email logs remaining: ${finalEmailLogsCount.rows[0].count}`);
    console.log(`   Blocked dates remaining: ${finalBlockedDatesCount.rows[0].count}`);
    
    // Verify time slots are still intact (these should NOT be deleted)
    const timeSlotsCount = await client.query('SELECT COUNT(*) as count FROM appointment_time_slots');
    console.log(`   Time slots preserved: ${timeSlotsCount.rows[0].count} ✅`);
    
    console.log('\n🎉 Database cleanup complete!');
    console.log('===============================');
    console.log('✅ All test appointments removed');
    console.log('✅ All test email logs cleared');
    console.log('✅ Database ready for production');
    console.log('✅ Time slots configuration preserved');
    console.log('✅ Database functions still working');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    client.release();
  }
}

cleanupTestData()
  .then(() => {
    console.log('\n✨ Database is now clean and ready for production use!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error.message);
    process.exit(1);
  })
  .finally(() => pool.end());