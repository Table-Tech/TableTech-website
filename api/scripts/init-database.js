#!/usr/bin/env node

/**
 * Database Initialization Script
 * Run this to set up the appointment database tables
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

async function runSchema() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Connected to database at:', testResult.rows[0].now);
    
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'database', 'enhanced-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Running database schema...');
    
    // Split schema into individual statements (basic approach)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      try {
        await pool.query(statement + ';');
        successCount++;
        process.stdout.write('.');
      } catch (error) {
        errorCount++;
        console.error('\n❌ Error executing statement:', error.message);
        console.error('Statement:', statement.substring(0, 100) + '...');
      }
    }
    
    console.log('\n');
    console.log(`✅ Schema execution complete: ${successCount} successful, ${errorCount} errors`);
    
    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('appointments', 'appointment_time_slots', 'email_logs', 'blocked_dates')
    `);
    
    console.log('\n📊 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`);
    });
    
    // Check time slots
    const slotsResult = await pool.query('SELECT COUNT(*) as count FROM appointment_time_slots');
    console.log(`\n⏰ Time slots configured: ${slotsResult.rows[0].count}`);
    
    console.log('\n🎉 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
runSchema().catch(console.error);