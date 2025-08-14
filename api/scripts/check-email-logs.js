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

async function checkEmailLogs() {
  const client = await pool.connect();
  
  try {
    console.log('📧 Checking Email Logs...\n');
    
    // Get all email logs
    const emailLogs = await client.query(`
      SELECT 
        id,
        appointment_id,
        email_type,
        status,
        error_message,
        sent_at
      FROM email_logs 
      ORDER BY sent_at DESC
    `);
    
    console.log(`Found ${emailLogs.rows.length} email log entries:`);
    console.log('=====================================\n');
    
    if (emailLogs.rows.length === 0) {
      console.log('❌ No email logs found - emails are not being logged');
      
      // Check if appointments exist without email logs
      const appointments = await client.query('SELECT COUNT(*) as count FROM appointments');
      console.log(`📅 Appointments in database: ${appointments.rows[0].count}`);
      
      if (appointments.rows[0].count > 0) {
        console.log('⚠️  Appointments exist but no email logs - email system not working');
      }
    } else {
      emailLogs.rows.forEach((log, index) => {
        console.log(`${index + 1}. Email Log Entry:`);
        console.log(`   ID: ${log.id}`);
        console.log(`   Appointment ID: ${log.appointment_id || 'N/A'}`);
        console.log(`   Type: ${log.email_type}`);
        console.log(`   Status: ${log.status} ${log.status === 'failed' ? '❌' : '✅'}`);
        console.log(`   Error: ${log.error_message || 'None'}`);
        console.log(`   Sent At: ${log.sent_at}`);
        console.log('');
      });
    }
    
    // Check recent appointments vs email logs
    const recentAppointments = await client.query(`
      SELECT 
        a.id,
        a.reference_number,
        a.appointment_date,
        a.appointment_time,
        a.restaurant_name,
        a.created_at,
        (SELECT COUNT(*) FROM email_logs el WHERE el.appointment_id = a.id) as email_count
      FROM appointments a 
      ORDER BY a.created_at DESC 
      LIMIT 5
    `);
    
    console.log('\n📅 Recent Appointments & Email Status:');
    console.log('======================================');
    
    recentAppointments.rows.forEach(appt => {
      console.log(`${appt.reference_number}: ${appt.restaurant_name}`);
      console.log(`   Date: ${appt.appointment_date} ${appt.appointment_time}`);
      console.log(`   Email Logs: ${appt.email_count} ${appt.email_count > 0 ? '✅' : '❌'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking email logs:', error);
  } finally {
    client.release();
  }
}

checkEmailLogs()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
  .finally(() => pool.end());