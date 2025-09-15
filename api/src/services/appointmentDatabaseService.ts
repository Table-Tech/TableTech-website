import { pool, query } from '../lib/database/config';

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

      // Email logging removed - no email_logs table

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
      // Define business hours time slots
      const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30'
      ];

      // Check if date is blocked
      const blockedResult = await query(
        `SELECT 1 FROM blocked_dates WHERE blocked_date = $1`,
        [date]
      );

      if (blockedResult.rows.length > 0) {
        // Date is blocked, all slots unavailable
        return timeSlots.map(time => ({
          time,
          isAvailable: false
        }));
      }

      // Get booked appointments for this date
      const bookedResult = await query(
        `SELECT appointment_time FROM appointments
         WHERE appointment_date = $1
         AND status IN ('pending', 'confirmed')
         AND deleted_at IS NULL`,
        [date]
      );

      const bookedTimes = new Set(
        bookedResult.rows.map(row => row.appointment_time.substring(0, 5))
      );

      return timeSlots.map(time => ({
        time,
        isAvailable: !bookedTimes.has(time)
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
      // Check if date is blocked
      const blockedResult = await query(
        `SELECT 1 FROM blocked_dates WHERE blocked_date = $1`,
        [date]
      );

      if (blockedResult.rows.length > 0) {
        return false;
      }

      // Check if slot is already booked
      const result = await query(
        `SELECT 1 FROM appointments
         WHERE appointment_date = $1
         AND appointment_time = $2
         AND status IN ('pending', 'confirmed')
         AND deleted_at IS NULL`,
        [date, time]
      );

      return result.rows.length === 0;
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
      const slots = await this.getAvailableSlots(date);
      return !slots.some(slot => slot.isAvailable);
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
        // Email logging removed - no email_logs table
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
   * Update email log status - deprecated (no email_logs table)
   */
  async updateEmailLogStatus(_appointmentId: string, _emailType: string, _status: string, _errorMessage?: string): Promise<void> {
    // Email logging removed - no email_logs table
    console.log('Email status update skipped - no email_logs table');
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
    try {
      const result = await query(`SELECT generate_reference_number() as ref_number`);
      return result.rows[0].ref_number;
    } catch (error) {
      // Fallback to JavaScript generation if function doesn't exist
      const prefix = 'TT';
      const dateStr = new Date().toISOString().slice(5, 10).replace('-', '');
      const random = Math.random().toString(36).substr(2, 4).toUpperCase();
      return `${prefix}${dateStr}-${random}`;
    }
  }

  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
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

      // Simple date blocked checker
      await query(`
        CREATE OR REPLACE FUNCTION is_date_blocked(check_date DATE)
        RETURNS BOOLEAN AS $$
        BEGIN
            RETURN EXISTS(
                SELECT 1 FROM blocked_dates
                WHERE blocked_date = check_date
            );
        END;
        $$ LANGUAGE plpgsql;
      `);

      // Slot availability checker
      await query(`
        CREATE OR REPLACE FUNCTION is_slot_available(
            check_date DATE,
            check_time TIME
        )
        RETURNS BOOLEAN AS $$
        BEGIN
            -- Check if date is blocked
            IF is_date_blocked(check_date) THEN
                RETURN FALSE;
            END IF;

            -- Check if slot is already booked
            RETURN NOT EXISTS(
                SELECT 1 FROM appointments
                WHERE appointment_date = check_date
                AND appointment_time = check_time
                AND status IN ('pending', 'confirmed')
                AND deleted_at IS NULL
            );
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

      const blockedDatesExist = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'blocked_dates'
        )`
      );

      // Create missing tables
      if (!appointmentsExist.rows[0].exists) {
        console.log('🔧 Creating appointments table...');
        await query(`
          CREATE TABLE appointments (
              id SERIAL PRIMARY KEY,
              reference_number VARCHAR(50) UNIQUE NOT NULL,
              first_name VARCHAR(255),
              last_name VARCHAR(255),
              email VARCHAR(255) NOT NULL,
              phone VARCHAR(50),
              restaurant_name VARCHAR(255),
              appointment_date DATE NOT NULL,
              appointment_time TIME NOT NULL,
              appointment_end_time TIME,
              duration_minutes INTEGER DEFAULT 30,
              message TEXT,
              status VARCHAR(50) DEFAULT 'pending',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP
          );
        `);
        console.log('✅ Appointments table created');
      }

      if (!blockedDatesExist.rows[0].exists) {
        console.log('🔧 Creating blocked_dates table...');
        await query(`
          CREATE TABLE blocked_dates (
              id SERIAL PRIMARY KEY,
              blocked_date DATE NOT NULL UNIQUE,
              reason TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Blocked dates table created');
      }

      // Create indexes if they don't exist
      await query(`
        CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
        CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(appointment_time);
        CREATE INDEX IF NOT EXISTS idx_appointments_reference ON appointments(reference_number);
        CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
        CREATE INDEX IF NOT EXISTS idx_appointments_deleted ON appointments(deleted_at);
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
   * Public query method for hybrid service
   */
  async query(sql: string, params?: any[]): Promise<any> {
    return query(sql, params);
  }
}

export default new AppointmentDatabaseService();