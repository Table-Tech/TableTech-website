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

async function emptyAllTables() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 EMPTYING ALL TABLES - Making everything completely clean...\n');
    
    // Show current data before deletion
    console.log('📊 Current data in tables:');
    const tables = ['appointments', 'appointment_time_slots', 'email_logs', 'blocked_dates'];
    
    for (const table of tables) {
      const count = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`   ${table}: ${count.rows[0].count} rows`);
    }
    
    console.log('\n🔄 DELETING ALL DATA from all tables...');
    
    // Delete ALL data from ALL tables
    await client.query('DELETE FROM email_logs');
    console.log('✅ email_logs - EMPTIED');
    
    await client.query('DELETE FROM appointments');  
    console.log('✅ appointments - EMPTIED');
    
    await client.query('DELETE FROM appointment_time_slots');
    console.log('✅ appointment_time_slots - EMPTIED');
    
    await client.query('DELETE FROM blocked_dates');
    console.log('✅ blocked_dates - EMPTIED');
    
    // Verify all tables are now empty
    console.log('\n🔍 Verifying all tables are EMPTY:');
    
    for (const table of tables) {
      const count = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      const isEmpty = count.rows[0].count === '0';
      console.log(`   ${table}: ${count.rows[0].count} rows ${isEmpty ? '✅ EMPTY' : '❌ NOT EMPTY'}`);
    }
    
    // Also check if any functions or triggers still exist (optional cleanup)
    console.log('\n🔧 Database functions status:');
    const functions = await client.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_schema = 'public' 
      AND routine_name LIKE '%appointment%' OR routine_name LIKE '%reference%'
      ORDER BY routine_name
    `);
    
    if (functions.rows.length > 0) {
      console.log('   Database functions found:');
      functions.rows.forEach(func => {
        console.log(`   - ${func.routine_name}`);
      });
      console.log('   (Functions kept for future use)');
    } else {
      console.log('   No custom functions found');
    }
    
    console.log('\n🎉 COMPLETE CLEANUP FINISHED!');
    console.log('============================');
    console.log('✅ ALL tables are now COMPLETELY EMPTY');
    console.log('✅ NO data remains in any table');
    console.log('✅ Database structure preserved');
    console.log('✅ Ready for fresh start');
    console.log('');
    console.log('⚠️  NOTE: You will need to re-add time slots if you want them');
    console.log('   Run: node scripts/add-default-timeslots.js');
    
  } catch (error) {
    console.error('❌ Error emptying tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

emptyAllTables()
  .then(() => {
    console.log('\n✨ All tables are now COMPLETELY EMPTY!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error.message);
    process.exit(1);
  })
  .finally(() => pool.end());