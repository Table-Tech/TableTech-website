const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_8ns5KxpScHkJ@ep-nameless-leaf-a299bh1h-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkDatabase() {
  let client;
  try {
    console.log('🔄 Connecting to database...');
    client = await pool.connect();
    console.log('✅ Connected to database successfully');

    // Check what tables exist
    const tablesResult = await client.query(`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Current tables:');
    if (tablesResult.rows.length === 0) {
      console.log('  ❌ NO TABLES FOUND!');
    } else {
      tablesResult.rows.forEach(row => {
        console.log('  -', row.table_name);
      });
    }

    // Check functions
    const functionsResult = await client.query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
      AND routine_name IN ('get_available_slots', 'is_time_slot_available', 'generate_reference_number')
      ORDER BY routine_name;
    `);

    console.log('🔧 Appointment-related functions:');
    if (functionsResult.rows.length === 0) {
      console.log('  ❌ NO APPOINTMENT FUNCTIONS FOUND!');
    } else {
      functionsResult.rows.forEach(row => {
        console.log('  -', row.routine_name);
      });
    }

    // Check if this is a connection/database issue
    const dbInfo = await client.query('SELECT current_database(), current_user, version()');
    console.log('🗄️ Database info:');
    console.log('  - Database:', dbInfo.rows[0].current_database);
    console.log('  - User:', dbInfo.rows[0].current_user);
    console.log('  - Version:', dbInfo.rows[0].version.substring(0, 50) + '...');

  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

checkDatabase();