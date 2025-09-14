const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_8ns5KxpScHkJ@ep-nameless-leaf-a299bh1h-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createMissingTables() {
  let client;
  try {
    console.log('🔄 Connecting to database...');
    client = await pool.connect();
    console.log('✅ Connected to database successfully');

    // Create appointments table
    console.log('🔄 Creating appointments table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          reference_number VARCHAR(12) UNIQUE NOT NULL,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          appointment_end_time TIME NOT NULL,
          status VARCHAR(50) DEFAULT 'confirmed',
          restaurant_name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT unique_appointment_slot UNIQUE (appointment_date, appointment_time)
      );
    `);
    console.log('✅ appointments table created');

    // Create email_logs table
    console.log('🔄 Creating email_logs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
          email_type VARCHAR(100) NOT NULL,
          email_hash VARCHAR(64),
          sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'sent',
          error_message TEXT
      );
    `);
    console.log('✅ email_logs table created');

    // Create indexes
    console.log('🔄 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date, appointment_time);
      CREATE INDEX IF NOT EXISTS idx_appointments_reference ON appointments(reference_number);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
      CREATE INDEX IF NOT EXISTS idx_email_logs_appointment ON email_logs(appointment_id);
    `);
    console.log('✅ indexes created');

    // Create update trigger
    console.log('🔄 Creating update trigger...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
      CREATE TRIGGER update_appointments_updated_at
          BEFORE UPDATE ON appointments
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ update trigger created');

    // Test the setup
    console.log('🧪 Testing database functions...');

    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 1); // Tomorrow
    const dateString = testDate.toISOString().split('T')[0];

    const slotsResult = await client.query('SELECT * FROM get_available_slots($1::date)', [dateString]);
    console.log(`✅ get_available_slots test: Found ${slotsResult.rows.length} slots for ${dateString}`);

    // Show some example slots
    if (slotsResult.rows.length > 0) {
      console.log('📋 Available slots:');
      slotsResult.rows.slice(0, 5).forEach(slot => {
        console.log(`   - ${slot.slot_time.substring(0,5)}: ${slot.is_available ? 'Available' : 'Booked'}`);
      });
    }

    const availabilityResult = await client.query('SELECT is_time_slot_available($1::date, $2::time) as available', [dateString, '10:00']);
    console.log(`✅ is_time_slot_available test: 10:00 slot is ${availabilityResult.rows[0].available ? 'available' : 'not available'}`);

    // Check all tables exist
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 All tables:');
    tablesResult.rows.forEach(row => {
      console.log('  -', row.table_name);
    });

    console.log('🎉 Database setup completed successfully!');
    console.log('✅ Your API should now work properly');

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

createMissingTables();