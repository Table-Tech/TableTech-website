import { pool, query } from '../lib/database/config';
import crypto from 'crypto';

interface AppointmentData {
  restaurantName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  message?: string;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

class AppointmentDatabaseService {
  /**
   * Create a new appointment with privacy-focused approach
   * Returns reference number for the appointment
   */
  async createAppointment(data: AppointmentData): Promise<{ id: string; referenceNumber: string }> {
    try {
      // Check if time slot is available
      const isAvailable = await this.isTimeSlotAvailable(data.date, data.time);
      if (!isAvailable) {
        throw new Error('This time slot is no longer available');
      }

      // Generate reference number
      const referenceNumber = await this.generateReferenceNumber();
      
      // Calculate end time (assuming 60 minute appointments)
      const endTime = this.calculateEndTime(data.time, 60);

      // Create appointment (no personal data stored)
      const result = await query(
        `INSERT INTO appointments (
          reference_number, 
          appointment_date, 
          appointment_time, 
          appointment_end_time,
          restaurant_name,
          status
        ) VALUES ($1, $2, $3, $4, $5, 'confirmed') 
        RETURNING id, reference_number`,
        [referenceNumber, data.date, data.time, endTime, data.restaurantName]
      );

      const appointment = result.rows[0];

      // Hash email for logging purposes only
      const emailHash = this.hashEmail(data.email);
      
      // Log email sent (no personal data)
      await query(
        `INSERT INTO email_logs (appointment_id, email_type, email_hash, status) 
         VALUES ($1, 'confirmation', $2, 'pending')`,
        [appointment.id, emailHash]
      );

      return {
        id: appointment.id,
        referenceNumber: appointment.reference_number
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Get available time slots for a specific date
   */
  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    try {
      const result = await query(
        `SELECT * FROM get_available_slots($1::date)`,
        [date]
      );

      return result.rows.map(row => ({
        time: row.slot_time.substring(0, 5), // Format: HH:MM
        isAvailable: row.is_available
      }));
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw error;
    }
  }

  /**
   * Check if a specific time slot is available
   */
  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    try {
      const result = await query(
        `SELECT is_time_slot_available($1::date, $2::time) as available`,
        [date, time]
      );

      return result.rows[0]?.available || false;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }

  /**
   * Check if a date is fully booked (no available slots)
   */
  async isDateFullyBooked(date: string): Promise<boolean> {
    try {
      const result = await query(
        `SELECT COUNT(*) as available_count
         FROM get_available_slots($1::date)
         WHERE is_available = true`,
        [date]
      );

      return parseInt(result.rows[0]?.available_count || '0') === 0;
    } catch (error) {
      console.error('Error checking if date is fully booked:', error);
      return false;
    }
  }

  /**
   * Get available dates for a month (only dates with available slots)
   */
  async getAvailableDates(year: number, month: number): Promise<string[]> {
    try {
      // Generate all dates for the month
      const daysInMonth = new Date(year, month, 0).getDate();
      const dates: string[] = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(date).getDay();
        
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        
        // Skip past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(date) < today) continue;
        
        // Check if date has available slots
        const isFullyBooked = await this.isDateFullyBooked(date);
        if (!isFullyBooked) {
          dates.push(date);
        }
      }
      
      return dates;
    } catch (error) {
      console.error('Error getting available dates:', error);
      return [];
    }
  }

  /**
   * Get appointment by reference number (no personal data returned)
   */
  async getAppointmentByReference(referenceNumber: string): Promise<any> {
    try {
      const result = await query(
        `SELECT 
          id,
          reference_number,
          appointment_date,
          appointment_time,
          restaurant_name,
          status,
          created_at
        FROM appointments 
        WHERE reference_number = $1`,
        [referenceNumber]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw error;
    }
  }

  /**
   * Cancel appointment by reference number
   */
  async cancelAppointment(referenceNumber: string): Promise<boolean> {
    try {
      const result = await query(
        `UPDATE appointments 
         SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
         WHERE reference_number = $1 AND status = 'confirmed'
         RETURNING id`,
        [referenceNumber]
      );

      if (result.rows.length > 0) {
        // Log cancellation
        await query(
          `INSERT INTO email_logs (appointment_id, email_type, status) 
           VALUES ($1, 'cancellation', 'pending')`,
          [result.rows[0].id]
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  /**
   * Get all booked slots for a date range (for calendar display)
   */
  async getBookedSlots(startDate: string, endDate: string): Promise<any[]> {
    try {
      const result = await query(
        `SELECT 
          appointment_date,
          appointment_time,
          appointment_end_time
        FROM appointments 
        WHERE appointment_date BETWEEN $1 AND $2
        AND status IN ('confirmed', 'pending')
        ORDER BY appointment_date, appointment_time`,
        [startDate, endDate]
      );

      return result.rows.map(row => ({
        date: row.appointment_date,
        startTime: row.appointment_time.substring(0, 5),
        endTime: row.appointment_end_time.substring(0, 5)
      }));
    } catch (error) {
      console.error('Error getting booked slots:', error);
      throw error;
    }
  }

  /**
   * Update email log status
   */
  async updateEmailLogStatus(appointmentId: string, emailType: string, status: string, errorMessage?: string): Promise<void> {
    try {
      await query(
        `UPDATE email_logs 
         SET status = $1, error_message = $2
         WHERE appointment_id = $3 AND email_type = $4`,
        [status, errorMessage || null, appointmentId, emailType]
      );
    } catch (error) {
      console.error('Error updating email log:', error);
    }
  }

  /**
   * Block a specific date (e.g., holidays)
   */
  async blockDate(date: string, reason?: string): Promise<void> {
    try {
      await query(
        `INSERT INTO blocked_dates (blocked_date, reason) 
         VALUES ($1, $2) 
         ON CONFLICT (blocked_date) DO UPDATE SET reason = $2`,
        [date, reason || 'Admin blocked']
      );
    } catch (error) {
      console.error('Error blocking date:', error);
      throw error;
    }
  }

  /**
   * Unblock a date
   */
  async unblockDate(date: string): Promise<void> {
    try {
      await query(
        `DELETE FROM blocked_dates WHERE blocked_date = $1`,
        [date]
      );
    } catch (error) {
      console.error('Error unblocking date:', error);
      throw error;
    }
  }

  /**
   * Get blocked dates for a month
   */
  async getBlockedDates(year: number, month: number): Promise<string[]> {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const result = await query(
        `SELECT blocked_date FROM blocked_dates 
         WHERE blocked_date BETWEEN $1 AND $2`,
        [startDate, endDate]
      );

      return result.rows.map(row => row.blocked_date);
    } catch (error) {
      console.error('Error getting blocked dates:', error);
      return [];
    }
  }

  /**
   * Clean up old appointments (GDPR compliance)
   */
  async cleanupOldAppointments(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await query(
        `DELETE FROM appointments 
         WHERE created_at < $1 
         AND status IN ('completed', 'cancelled', 'no-show')
         RETURNING id`,
        [cutoffDate.toISOString()]
      );

      return result.rows.length;
    } catch (error) {
      console.error('Error cleaning up old appointments:', error);
      return 0;
    }
  }

  /**
   * Private helper methods
   */
  
  private async generateReferenceNumber(): Promise<string> {
    const result = await query(`SELECT generate_reference_number() as ref_number`);
    return result.rows[0].ref_number;
  }

  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }

  private hashEmail(email: string): string {
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
  }

  private async ensureFunctionsExist(): Promise<void> {
    try {
      console.log('🔧 Ensuring critical database functions exist...');

      // Generate reference number function
      await query(`
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
      await query(`
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

      // Available slots function
      await query(`
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

      console.log('✅ Critical database functions ensured');
    } catch (error) {
      console.error('❌ Failed to ensure functions exist:', error);
      throw error;
    }
  }

  /**
   * Initialize database tables - Auto-creates missing tables and functions
   */
  async initializeDatabase(): Promise<void> {
    try {
      console.log('🔄 Initializing appointment database...');

      // Test connection
      const connected = await pool.query('SELECT NOW()');
      console.log('✅ Database connected:', connected.rows[0].now);

      // Start transaction for atomic initialization
      await query('BEGIN;');
      console.log('🔒 Started database initialization transaction');

      // Enable required extensions
      await query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

      // Check if critical tables exist
      const appointmentsExist = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'appointments'
        )`
      );

      const emailLogsExist = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'email_logs'
        )`
      );

      const timeSlotsExist = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'appointment_time_slots'
        )`
      );

      // Create missing tables
      if (!appointmentsExist.rows[0].exists) {
        console.log('🔧 Creating appointments table...');
        await query(`
          CREATE TABLE appointments (
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
        console.log('✅ Appointments table created');
      }

      if (!emailLogsExist.rows[0].exists) {
        console.log('🔧 Creating email_logs table...');
        await query(`
          CREATE TABLE email_logs (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
              email_type VARCHAR(100) NOT NULL,
              email_hash VARCHAR(64),
              sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'pending')),
              error_message TEXT
          );
        `);
        console.log('✅ Email logs table created');
      }

      if (!timeSlotsExist.rows[0].exists) {
        console.log('🔧 Creating appointment_time_slots table...');
        await query(`
          CREATE TABLE appointment_time_slots (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
              start_time TIME NOT NULL,
              end_time TIME NOT NULL,
              duration_minutes INTEGER DEFAULT 60,
              is_available BOOLEAN DEFAULT true,
              max_appointments_per_slot INTEGER DEFAULT 1,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT unique_day_time_slot UNIQUE (day_of_week, start_time)
          );
        `);

        // Insert default time slots for weekdays
        console.log('🔧 Inserting default time slots...');
        await query(`
          INSERT INTO appointment_time_slots (day_of_week, start_time, end_time, duration_minutes) VALUES
          -- Monday (1) to Friday (5)
          (1, '09:00', '10:00', 60),
          (1, '10:00', '11:00', 60),
          (1, '11:00', '12:00', 60),
          (1, '13:00', '14:00', 60),
          (1, '14:00', '15:00', 60),
          (1, '15:00', '16:00', 60),
          (1, '16:00', '17:00', 60),
          (2, '09:00', '10:00', 60),
          (2, '10:00', '11:00', 60),
          (2, '11:00', '12:00', 60),
          (2, '13:00', '14:00', 60),
          (2, '14:00', '15:00', 60),
          (2, '15:00', '16:00', 60),
          (2, '16:00', '17:00', 60),
          (3, '09:00', '10:00', 60),
          (3, '10:00', '11:00', 60),
          (3, '11:00', '12:00', 60),
          (3, '13:00', '14:00', 60),
          (3, '14:00', '15:00', 60),
          (3, '15:00', '16:00', 60),
          (3, '16:00', '17:00', 60),
          (4, '09:00', '10:00', 60),
          (4, '10:00', '11:00', 60),
          (4, '11:00', '12:00', 60),
          (4, '13:00', '14:00', 60),
          (4, '14:00', '15:00', 60),
          (4, '15:00', '16:00', 60),
          (4, '16:00', '17:00', 60),
          (5, '09:00', '10:00', 60),
          (5, '10:00', '11:00', 60),
          (5, '11:00', '12:00', 60),
          (5, '13:00', '14:00', 60),
          (5, '14:00', '15:00', 60),
          (5, '15:00', '16:00', 60),
          (5, '16:00', '17:00', 60)
          ON CONFLICT (day_of_week, start_time) DO NOTHING;
        `);
        console.log('✅ Appointment time slots table created and populated');
      }

      // Create indexes if they don't exist
      await query(`
        CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date, appointment_time);
        CREATE INDEX IF NOT EXISTS idx_appointments_reference ON appointments(reference_number);
        CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
        CREATE INDEX IF NOT EXISTS idx_email_logs_appointment ON email_logs(appointment_id);
        CREATE INDEX IF NOT EXISTS idx_time_slots_day_time ON appointment_time_slots(day_of_week, start_time);
        CREATE INDEX IF NOT EXISTS idx_time_slots_available ON appointment_time_slots(is_available);
      `);

      // Ensure critical functions exist
      await this.ensureFunctionsExist();

      // Create update trigger
      await query(`
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

      // Commit transaction
      await query('COMMIT;');
      console.log('✅ Database initialization completed successfully');

    } catch (error) {
      // Rollback transaction on error
      try {
        await query('ROLLBACK;');
        console.log('🔄 Transaction rolled back due to error');
      } catch (rollbackError) {
        console.error('❌ Failed to rollback transaction:', rollbackError);
      }
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Ensure time slots exist - Safe method to re-create time slots if missing
   */
  async ensureTimeSlots(): Promise<void> {
    try {
      console.log('🔧 Ensuring time slots are populated...');

      // Re-insert default time slots (using ON CONFLICT DO NOTHING for safety)
      await query(`
        INSERT INTO appointment_time_slots (day_of_week, start_time, end_time, duration_minutes) VALUES
        -- Monday (1) to Friday (5)
        (1, '09:00', '10:00', 60),
        (1, '10:00', '11:00', 60),
        (1, '11:00', '12:00', 60),
        (1, '13:00', '14:00', 60),
        (1, '14:00', '15:00', 60),
        (1, '15:00', '16:00', 60),
        (1, '16:00', '17:00', 60),
        (2, '09:00', '10:00', 60),
        (2, '10:00', '11:00', 60),
        (2, '11:00', '12:00', 60),
        (2, '13:00', '14:00', 60),
        (2, '14:00', '15:00', 60),
        (2, '15:00', '16:00', 60),
        (2, '16:00', '17:00', 60),
        (3, '09:00', '10:00', 60),
        (3, '10:00', '11:00', 60),
        (3, '11:00', '12:00', 60),
        (3, '13:00', '14:00', 60),
        (3, '14:00', '15:00', 60),
        (3, '15:00', '16:00', 60),
        (3, '16:00', '17:00', 60),
        (4, '09:00', '10:00', 60),
        (4, '10:00', '11:00', 60),
        (4, '11:00', '12:00', 60),
        (4, '13:00', '14:00', 60),
        (4, '14:00', '15:00', 60),
        (4, '15:00', '16:00', 60),
        (4, '16:00', '17:00', 60),
        (5, '09:00', '10:00', 60),
        (5, '10:00', '11:00', 60),
        (5, '11:00', '12:00', 60),
        (5, '13:00', '14:00', 60),
        (5, '14:00', '15:00', 60),
        (5, '15:00', '16:00', 60),
        (5, '16:00', '17:00', 60)
        ON CONFLICT (day_of_week, start_time) DO NOTHING;
      `);

      const result = await query('SELECT COUNT(*) FROM appointment_time_slots');
      console.log(`✅ Time slots ensured: ${result.rows[0].count} total slots`);
    } catch (error) {
      console.error('❌ Failed to ensure time slots:', error);
      throw error;
    }
  }

  /**
   * Public query method for hybrid service
   */
  async query(sql: string, params?: any[]): Promise<any> {
    return query(sql, params);
  }
}

export default new AppointmentDatabaseService();