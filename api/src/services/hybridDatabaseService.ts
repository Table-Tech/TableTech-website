import appointmentDb from './appointmentDatabaseService';
import sqliteBackup from './sqliteBackupService';
import { logger } from '../lib/logging/logger';

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

class HybridDatabaseService {
  private isPostgresAvailable = true;
  private initializationInProgress = false;
  private initializationPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    // Prevent concurrent initialization
    if (this.initializationInProgress) {
      if (this.initializationPromise) {
        await this.initializationPromise;
      }
      return;
    }

    this.initializationInProgress = true;
    this.initializationPromise = this.performInitialization();

    try {
      await this.initializationPromise;
    } finally {
      this.initializationInProgress = false;
      this.initializationPromise = null;
    }
  }

  private async performInitialization(): Promise<void> {
    try {
      // Always initialize SQLite as backup
      await sqliteBackup.initialize();
      logger.info('✅ SQLite backup initialized');

      // Try PostgreSQL initialization
      await appointmentDb.initializeDatabase();
      this.isPostgresAvailable = true;
      logger.info('✅ PostgreSQL primary database initialized');

      // Verify data integrity after initialization
      await this.verifyReferenceData();

      // Log database state for debugging
      await this.logDatabaseState();
    } catch (error) {
      logger.error('❌ PostgreSQL initialization failed, using SQLite only:', error);
      this.isPostgresAvailable = false;
    }
  }

  private async executeWithFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    // Try primary database first
    if (this.isPostgresAvailable) {
      try {
        return await primaryOperation();
      } catch (error) {
        logger.warn(`❌ PostgreSQL ${operationName} failed, falling back to SQLite:`, error);
        this.isPostgresAvailable = false;

        // Auto-recovery attempt (only if not already in progress)
        if (!this.initializationInProgress) {
          setTimeout(async () => {
            try {
              logger.info('🔄 Attempting PostgreSQL auto-recovery...');
              await this.initialize(); // Use the safe initialization method
              if (this.isPostgresAvailable) {
                logger.info('✅ PostgreSQL recovered automatically');
              }
            } catch (recoveryError) {
              logger.error('❌ PostgreSQL auto-recovery failed:', recoveryError);
            }
          }, 5000);
        }
      }
    }

    // Use fallback database
    logger.info(`🔄 Using SQLite for ${operationName}`);
    return await fallbackOperation();
  }

  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    return this.executeWithFallback(
      () => appointmentDb.getAvailableSlots(date),
      () => sqliteBackup.getAvailableSlots(date),
      'getAvailableSlots'
    );
  }

  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    return this.executeWithFallback(
      () => appointmentDb.isTimeSlotAvailable(date, time),
      () => sqliteBackup.isTimeSlotAvailable(date, time),
      'isTimeSlotAvailable'
    );
  }

  async createAppointment(data: AppointmentData): Promise<{ id: string; referenceNumber: string }> {
    const calculateEndTime = (startTime: string, durationMinutes: number): string => {
      const [hours, minutes] = startTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + durationMinutes;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    };

    const endTime = calculateEndTime(data.time, 60);

    return this.executeWithFallback(
      async () => appointmentDb.createAppointment(data),
      async () => {
        const referenceNumber = await sqliteBackup.generateReferenceNumber();
        await sqliteBackup.createAppointment({
          referenceNumber,
          restaurantName: data.restaurantName,
          date: data.date,
          time: data.time,
          endTime
        });
        return { id: Date.now().toString(), referenceNumber };
      },
      'createAppointment'
    );
  }

  async getAvailableDates(year: number, month: number): Promise<string[]> {
    return this.executeWithFallback(
      () => appointmentDb.getAvailableDates(year, month),
      async () => {
        // Fallback: generate weekdays for the month
        const daysInMonth = new Date(year, month, 0).getDate();
        const dates: string[] = [];

        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month - 1, day);
          const dayOfWeek = date.getDay();

          // Skip weekends and past dates
          if (dayOfWeek === 0 || dayOfWeek === 6) continue;

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (date < today) continue;

          const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

          // Check if date has available slots
          const slots = await sqliteBackup.getAvailableSlots(dateString);
          if (slots.some(slot => slot.isAvailable)) {
            dates.push(dateString);
          }
        }

        return dates;
      },
      'getAvailableDates'
    );
  }

  async updateEmailLogStatus(appointmentId: string, emailType: string, status: string, errorMessage?: string): Promise<void> {
    try {
      if (this.isPostgresAvailable) {
        await appointmentDb.updateEmailLogStatus(appointmentId, emailType, status, errorMessage);
      }
      // SQLite doesn't need email logs for the basic functionality
    } catch (error) {
      logger.warn('❌ Email log update failed:', error);
    }
  }

  private async verifyReferenceData(): Promise<void> {
    try {
      if (this.isPostgresAvailable) {
        // Check PostgreSQL time slots
        const result = await appointmentDb.query('SELECT COUNT(*) FROM appointment_time_slots');
        const count = parseInt(result.rows[0].count);

        if (count < 35) {
          logger.warn(`⚠️ PostgreSQL time slots incomplete: ${count}/35 slots found`);
          // Force re-initialization of time slots
          await appointmentDb.ensureTimeSlots();
        } else {
          logger.info(`✅ PostgreSQL time slots verified: ${count} slots available`);
        }
      }
    } catch (error) {
      logger.error('❌ Reference data verification failed:', error);
    }
  }

  private async logDatabaseState(): Promise<void> {
    try {
      if (this.isPostgresAvailable) {
        const dbInfo = await appointmentDb.query('SELECT current_database(), current_schema(), current_user');
        const timeSlotsCount = await appointmentDb.query('SELECT COUNT(*) FROM appointment_time_slots');
        const appointmentsCount = await appointmentDb.query('SELECT COUNT(*) FROM appointments');

        logger.info('📊 Database State Report:', {
          database: dbInfo.rows[0].current_database,
          schema: dbInfo.rows[0].current_schema,
          user: dbInfo.rows[0].current_user,
          timeSlots: timeSlotsCount.rows[0].count,
          appointments: appointmentsCount.rows[0].count,
          url: process.env.DATABASE_URL?.substring(0, 50) + '...'
        });
      }
    } catch (error) {
      logger.error('❌ Failed to log database state:', error);
    }
  }

  /**
   * Start periodic health monitoring
   */
  startHealthMonitoring(): void {
    // Check every 5 minutes
    setInterval(async () => {
      await this.performHealthCheck();
    }, 300000);

    // Initial health check
    setTimeout(() => this.performHealthCheck(), 10000);
  }

  private async performHealthCheck(): Promise<void> {
    try {
      if (this.isPostgresAvailable) {
        const result = await appointmentDb.query('SELECT COUNT(*) FROM appointment_time_slots');
        const count = parseInt(result.rows[0].count);

        if (count < 10) {
          logger.error('🚨 CRITICAL: Time slots table empty or corrupted - data loss detected', {
            timeSlotsCount: count,
            timestamp: new Date().toISOString()
          });

          // Attempt immediate recovery
          await this.verifyReferenceData();
        }
      }
    } catch (error) {
      logger.warn('⚠️ Health check failed:', error);
    }
  }

  getDatabaseStatus(): { primary: string; backup: string } {
    return {
      primary: this.isPostgresAvailable ? 'PostgreSQL (Available)' : 'PostgreSQL (Unavailable)',
      backup: 'SQLite (Available)'
    };
  }
}

export default new HybridDatabaseService();