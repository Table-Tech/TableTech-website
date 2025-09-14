const { Pool } = require('pg');

// Database connection from environment
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_8ns5KxpScHkJ@ep-nameless-leaf-a299bh1h-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
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

    // Check what exists already
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const existingTables = tablesResult.rows.map(row => row.table_name);
    console.log('📋 Existing tables:', existingTables);

    // Check functions
    const functionsResult = await client.query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
      ORDER BY routine_name;
    `);

    const existingFunctions = functionsResult.rows.map(row => row.routine_name);
    console.log('🔧 Existing functions:', existingFunctions);

    // Enable extensions if needed
    console.log('🔄 Enabling required extensions...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    console.log('✅ Extensions enabled');

    // Create missing functions
    if (!existingFunctions.includes('generate_reference_number')) {
      console.log('🔄 Creating generate_reference_number function...');
      await client.query(`
        CREATE OR REPLACE FUNCTION generate_reference_number()
        RETURNS VARCHAR AS $$
        DECLARE
            ref_number VARCHAR;
            date_part VARCHAR;
            random_part VARCHAR;
            exists_check BOOLEAN;
        BEGIN
            -- Format: TTMMDD-XXXX (TT for TableTech, MMDD for month/day, XXXX random)
            date_part := 'TT' || TO_CHAR(CURRENT_DATE, 'MMDD');

            LOOP
                -- Generate random 4-character alphanumeric string
                random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
                ref_number := date_part || '-' || random_part;

                -- Check if this reference already exists
                EXISTS_CHECK := EXISTS(SELECT 1 FROM appointments WHERE reference_number = ref_number);

                EXIT WHEN NOT exists_check;
            END LOOP;

            RETURN ref_number;
        END;
        $$ LANGUAGE plpgsql;
      `);
      console.log('✅ generate_reference_number function created');
    }

    if (!existingFunctions.includes('is_time_slot_available')) {
      console.log('🔄 Creating is_time_slot_available function...');
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
            -- Get day of week (0=Sunday, 6=Saturday)
            day_week := EXTRACT(DOW FROM check_date);

            -- Check if date is blocked
            is_blocked := EXISTS(
                SELECT 1 FROM blocked_dates
                WHERE blocked_date = check_date
            );

            IF is_blocked THEN
                RETURN FALSE;
            END IF;

            -- Check if time slot exists for this day
            slot_exists := EXISTS(
                SELECT 1 FROM appointment_time_slots
                WHERE day_of_week = day_week
                AND start_time = check_time
                AND is_available = true
            );

            IF NOT slot_exists THEN
                RETURN FALSE;
            END IF;

            -- Check if already booked
            is_booked := EXISTS(
                SELECT 1 FROM appointments
                WHERE appointment_date = check_date
                AND appointment_time = check_time
                AND status IN ('confirmed', 'pending')
            );

            RETURN NOT is_booked;
        END;
        $$ LANGUAGE plpgsql;
      `);
      console.log('✅ is_time_slot_available function created');
    }

    if (!existingFunctions.includes('get_available_slots')) {
      console.log('🔄 Creating get_available_slots function...');
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
      console.log('✅ get_available_slots function created');
    }

    // Check if appointment_time_slots has data
    const slotsCount = await client.query('SELECT COUNT(*) FROM appointment_time_slots');
    if (parseInt(slotsCount.rows[0].count) === 0) {
      console.log('🔄 Adding default time slots...');
      await client.query(`
        INSERT INTO appointment_time_slots (day_of_week, start_time, end_time, duration_minutes)
        VALUES
            -- Monday (1)
            (1, '09:00', '10:00', 60),
            (1, '10:00', '11:00', 60),
            (1, '11:00', '12:00', 60),
            (1, '13:00', '14:00', 60),
            (1, '14:00', '15:00', 60),
            (1, '15:00', '16:00', 60),
            (1, '16:00', '17:00', 60),
            -- Tuesday (2)
            (2, '09:00', '10:00', 60),
            (2, '10:00', '11:00', 60),
            (2, '11:00', '12:00', 60),
            (2, '13:00', '14:00', 60),
            (2, '14:00', '15:00', 60),
            (2, '15:00', '16:00', 60),
            (2, '16:00', '17:00', 60),
            -- Wednesday (3)
            (3, '09:00', '10:00', 60),
            (3, '10:00', '11:00', 60),
            (3, '11:00', '12:00', 60),
            (3, '13:00', '14:00', 60),
            (3, '14:00', '15:00', 60),
            (3, '15:00', '16:00', 60),
            (3, '16:00', '17:00', 60),
            -- Thursday (4)
            (4, '09:00', '10:00', 60),
            (4, '10:00', '11:00', 60),
            (4, '11:00', '12:00', 60),
            (4, '13:00', '14:00', 60),
            (4, '14:00', '15:00', 60),
            (4, '15:00', '16:00', 60),
            (4, '16:00', '17:00', 60),
            -- Friday (5)
            (5, '09:00', '10:00', 60),
            (5, '10:00', '11:00', 60),
            (5, '11:00', '12:00', 60),
            (5, '13:00', '14:00', 60),
            (5, '14:00', '15:00', 60),
            (5, '15:00', '16:00', 60),
            (5, '16:00', '17:00', 60)
        ON CONFLICT (day_of_week, start_time) DO NOTHING;
      `);
      console.log('✅ Default time slots added');
    }

    // Test the functions
    console.log('🧪 Testing database functions...');

    // Test get_available_slots function
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 1); // Tomorrow
    const dateString = testDate.toISOString().split('T')[0];

    const slotsResult = await client.query('SELECT * FROM get_available_slots($1::date)', [dateString]);
    console.log(`✅ get_available_slots test: Found ${slotsResult.rows.length} slots for ${dateString}`);

    // Show some example slots
    slotsResult.rows.slice(0, 3).forEach(slot => {
      console.log(`   - ${slot.slot_time.substring(0,5)}: ${slot.is_available ? 'Available' : 'Booked'}`);
    });

    // Test is_time_slot_available function
    const availabilityResult = await client.query('SELECT is_time_slot_available($1::date, $2::time) as available', [dateString, '10:00']);
    console.log(`✅ is_time_slot_available test: 10:00 slot is ${availabilityResult.rows[0].available ? 'available' : 'not available'}`);

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

// Run the setup
setupDatabase();