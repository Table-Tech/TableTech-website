const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection from environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_8ns5KxpScHkJ@ep-nameless-leaf-a299bh1h-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  let client;
  try {
    console.log('🔄 Connecting to database...');
    client = await pool.connect();
    console.log('✅ Connected to database successfully');

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'src', 'lib', 'database', 'enhanced-schema.sql');
    console.log('📖 Reading schema file:', schemaPath);

    const sqlSchema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded');

    // Execute the schema
    console.log('🔄 Executing database schema...');
    await client.query(sqlSchema);
    console.log('✅ Database schema executed successfully');

    // Verify the setup by checking tables
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log('  -', row.table_name);
    });

    // Check functions
    const functionsResult = await client.query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
      ORDER BY routine_name;
    `);

    console.log('🔧 Created functions:');
    functionsResult.rows.forEach(row => {
      console.log('  -', row.routine_name);
    });

    // Test the functions
    console.log('🧪 Testing database functions...');

    // Test get_available_slots function
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 1); // Tomorrow
    const dateString = testDate.toISOString().split('T')[0];

    const slotsResult = await client.query('SELECT * FROM get_available_slots($1::date)', [dateString]);
    console.log(`✅ get_available_slots test: Found ${slotsResult.rows.length} slots for ${dateString}`);

    // Test is_time_slot_available function
    const availabilityResult = await client.query('SELECT is_time_slot_available($1::date, $2::time) as available', [dateString, '10:00']);
    console.log(`✅ is_time_slot_available test: 10:00 slot is ${availabilityResult.rows[0].available ? 'available' : 'not available'}`);

    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run the setup
setupDatabase();