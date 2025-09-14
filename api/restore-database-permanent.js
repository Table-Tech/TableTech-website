const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_8ns5KxpScHkJ@ep-nameless-leaf-a299bh1h-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function restoreDatabase() {
  let client;
  try {
    console.log('🔄 Connecting to database...');
    client = await pool.connect();
    console.log('✅ Connected to database successfully');

    // Enable extensions
    console.log('🔄 Enabling required extensions...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    console.log('✅ Extensions enabled');

    // Create appointments table with all constraints
    console.log('🔄 Creating appointments table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          reference_number VARCHAR(12) UNIQUE NOT NULL,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          appointment_end_time TIME NOT NULL,
          status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no-show', 'pending')),
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
          status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'pending')),
          error_message TEXT
      );
    `);
    console.log('✅ email_logs table created');

    // Create all indexes
    console.log('🔄 Creating performance indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date, appointment_time);
      CREATE INDEX IF NOT EXISTS idx_appointments_reference ON appointments(reference_number);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
      CREATE INDEX IF NOT EXISTS idx_email_logs_appointment ON email_logs(appointment_id);
      CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
    `);
    console.log('✅ Performance indexes created');

    // Recreate all functions to ensure they exist and are up to date
    console.log('🔄 Creating/updating database functions...');

    // Reference number generator
    await client.query(`
      CREATE OR REPLACE FUNCTION generate_reference_number()
      RETURNS VARCHAR AS $$
      DECLARE
          ref_number VARCHAR;
          date_part VARCHAR;
          random_part VARCHAR;
          exists_check BOOLEAN;
      BEGIN
          date_part := 'TT' || TO_CHAR(CURRENT_DATE, 'MMDD');

          LOOP
              random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
              ref_number := date_part || '-' || random_part;

              SELECT EXISTS(SELECT 1 FROM appointments WHERE reference_number = ref_number) INTO exists_check;

              EXIT WHEN NOT exists_check;
          END LOOP;

          RETURN ref_number;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Time slot availability checker
    await client.query(`
      CREATE OR REPLACE FUNCTION is_time_slot_available(
          check_date DATE,
          check_time TIME
      )
      RETURNS BOOLEAN AS $$
      DECLARE
          day_week INTEGER;
          is_blocked BOOLEAN;
          is_booked BOOLEAN;
          slot_exists BOOLEAN;
      BEGIN
          day_week := EXTRACT(DOW FROM check_date);

          -- Check if date is blocked
          SELECT EXISTS(
              SELECT 1 FROM blocked_dates
              WHERE blocked_date = check_date
          ) INTO is_blocked;

          IF is_blocked THEN
              RETURN FALSE;
          END IF;

          -- Check if time slot exists for this day
          SELECT EXISTS(
              SELECT 1 FROM appointment_time_slots
              WHERE day_of_week = day_week
              AND start_time = check_time
              AND is_available = true
          ) INTO slot_exists;

          IF NOT slot_exists THEN
              RETURN FALSE;
          END IF;

          -- Check if already booked
          SELECT EXISTS(
              SELECT 1 FROM appointments
              WHERE appointment_date = check_date
              AND appointment_time = check_time
              AND status IN ('confirmed', 'pending')
          ) INTO is_booked;

          RETURN NOT is_booked;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Available slots function
    await client.query(`
      CREATE OR REPLACE FUNCTION get_available_slots(check_date DATE)
      RETURNS TABLE(
          slot_time TIME,
          is_available BOOLEAN
      ) AS $$
      DECLARE
          day_week INTEGER;
      BEGIN
          day_week := EXTRACT(DOW FROM check_date);

          RETURN QUERY
          SELECT
              ts.start_time as slot_time,
              NOT EXISTS(
                  SELECT 1 FROM appointments a
                  WHERE a.appointment_date = check_date
                  AND a.appointment_time = ts.start_time
                  AND a.status IN ('confirmed', 'pending')
              ) AND NOT EXISTS(
                  SELECT 1 FROM blocked_dates bd
                  WHERE bd.blocked_date = check_date
              ) as is_available
          FROM appointment_time_slots ts
          WHERE ts.day_of_week = day_week
          AND ts.is_available = true
          ORDER BY ts.start_time;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Update trigger function
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

    console.log('✅ All database functions created/updated');

    // Add some sample data to test
    console.log('🔄 Testing database functionality...');

    // Test function calls
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 1);
    const dateString = testDate.toISOString().split('T')[0];

    const slotsResult = await client.query('SELECT * FROM get_available_slots($1::date)', [dateString]);
    console.log(`✅ Found ${slotsResult.rows.length} available slots for ${dateString}`);

    const availabilityResult = await client.query('SELECT is_time_slot_available($1::date, $2::time) as available', [dateString, '10:00']);
    console.log(`✅ 10:00 slot availability: ${availabilityResult.rows[0].available ? 'Available' : 'Not available'}`);

    // Final verification
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Final table list:');
    tablesResult.rows.forEach(row => {
      console.log('  ✓', row.table_name);
    });

    const functionsResult = await client.query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
      AND routine_name IN ('get_available_slots', 'is_time_slot_available', 'generate_reference_number')
      ORDER BY routine_name;
    `);

    console.log('🔧 Critical functions:');
    functionsResult.rows.forEach(row => {
      console.log('  ✓', row.routine_name);
    });

    console.log('🎉 Database restoration completed successfully!');
    console.log('📝 NOTE: If tables keep disappearing, consider:');
    console.log('   1. Upgrading Neon plan to prevent auto-sleep');
    console.log('   2. Setting up automatic table recreation in your API startup');
    console.log('   3. Using a more persistent database solution');

  } catch (error) {
    console.error('❌ Database restoration failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

restoreDatabase();