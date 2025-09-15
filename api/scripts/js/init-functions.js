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

async function createFunctions() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Creating database functions...');
    
    // Function to generate reference number
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
    console.log('✅ generate_reference_number function created');

    // Function to check availability
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
          
          SELECT EXISTS(
              SELECT 1 FROM blocked_dates 
              WHERE blocked_date = check_date
          ) INTO is_blocked;
          
          IF is_blocked THEN
              RETURN FALSE;
          END IF;
          
          SELECT EXISTS(
              SELECT 1 FROM appointment_time_slots 
              WHERE day_of_week = day_week 
              AND start_time = check_time
              AND is_available = true
          ) INTO slot_exists;
          
          IF NOT slot_exists THEN
              RETURN FALSE;
          END IF;
          
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
    console.log('✅ is_time_slot_available function created');

    // Function to get available slots
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

    // Update trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ update_updated_at_column function created');

    // Create trigger
    await client.query(`
      CREATE TRIGGER update_appointments_updated_at 
          BEFORE UPDATE ON appointments
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ update trigger created');

    console.log('🎉 All database functions created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating functions:', error);
    throw error;
  } finally {
    client.release();
  }
}

createFunctions()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
  .finally(() => pool.end());