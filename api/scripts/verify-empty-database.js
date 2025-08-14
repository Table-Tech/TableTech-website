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

async function verifyEmptyDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 FINAL VERIFICATION - Database Empty Status');
    console.log('===========================================\n');
    
    // Check all tables
    const tables = [
      'appointments',
      'appointment_time_slots', 
      'email_logs',
      'blocked_dates'
    ];
    
    console.log('📊 Table Status:');
    let totalRows = 0;
    
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      totalRows += count;
      
      console.log(`   ${table.padEnd(25)} : ${count.toString().padStart(3)} rows ${count === 0 ? '✅ EMPTY' : '❌ HAS DATA'}`);
    }
    
    console.log(`\n📈 Total rows across all tables: ${totalRows}`);
    
    // Check table structure still exists
    console.log('\n🏗️  Table Structure Status:');
    const structureCheck = await client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('appointments', 'appointment_time_slots', 'email_logs', 'blocked_dates')
      ORDER BY table_name
    `);
    
    structureCheck.rows.forEach(table => {
      console.log(`   ✅ ${table.table_name} (${table.table_type})`);
    });
    
    // Check functions still exist
    console.log('\n🔧 Database Functions:');
    const functions = await client.query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND (routine_name LIKE '%appointment%' OR routine_name LIKE '%reference%' OR routine_name LIKE '%available%')
      ORDER BY routine_name
    `);
    
    if (functions.rows.length > 0) {
      functions.rows.forEach(func => {
        console.log(`   ✅ ${func.routine_name}()`);
      });
    } else {
      console.log('   ❌ No appointment functions found');
    }
    
    // Final summary
    console.log('\n🎉 VERIFICATION COMPLETE!');
    console.log('========================');
    
    if (totalRows === 0) {
      console.log('✅ DATABASE IS COMPLETELY EMPTY');
      console.log('✅ All tables have 0 rows');
      console.log('✅ Table structure preserved');
      console.log('✅ Database functions preserved');
      console.log('✅ Ready for fresh production use');
      console.log('');
      console.log('💡 To add time slots back: node scripts/add-default-timeslots.js');
    } else {
      console.log('❌ DATABASE IS NOT EMPTY');
      console.log(`❌ Found ${totalRows} rows remaining`);
      console.log('❌ Manual cleanup may be needed');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

verifyEmptyDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
  .finally(() => pool.end());