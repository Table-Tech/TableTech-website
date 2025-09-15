import secureApi from '../utils/secureApi';
import securityManager from '../utils/security';

export interface AppointmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  restaurant: string;
  message?: string;
  date: string;
  time: string;
  [key: string]: string | undefined;
}

export interface AvailableSlot {
  time: string;
  isAvailable: boolean;
}

const APPOINTMENT_API_ENDPOINT = '/api/appointments';

export const submitSecureAppointment = async (data: AppointmentData): Promise<{ success: boolean; message: string }> => {
  // Validate all inputs
  if (!data.firstName || !data.lastName) {
    throw new Error('Name is required');
  }

  if (!securityManager.validateEmail(data.email)) {
    throw new Error('Invalid email format');
  }

  if (!securityManager.validatePhone(data.phone)) {
    throw new Error('Invalid phone number format');
  }

  if (!data.date || !data.time) {
    throw new Error('Date and time are required');
  }

  // Check for suspicious activity
  if (securityManager.detectSuspiciousActivity(data)) {
    securityManager.logSecurityEvent('SUSPICIOUS_ACTIVITY', { 
      type: 'appointment_submission',
      data 
    });
    throw new Error('Invalid input detected');
  }

  // Submit with rate limiting
  try {
    const response = await secureApi.submitForm<{ success: boolean; message: string }>(
      `${APPOINTMENT_API_ENDPOINT}/book`,
      data,
      {
        firstName: (value) => typeof value === 'string' && value.length > 0 && value.length <= 50,
        lastName: (value) => typeof value === 'string' && value.length > 0 && value.length <= 50,
        email: (value) => typeof value === 'string' && securityManager.validateEmail(value),
        phone: (value) => typeof value === 'string' && securityManager.validatePhone(value),
        restaurant: (value) => typeof value === 'string' && value.length > 0 && value.length <= 100,
        message: (value) => !value || (typeof value === 'string' && value.length <= 500),
        date: (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value),
        time: (value) => typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)
      }
    );

    // Store appointment securely in encrypted format
    if (response.success) {
      const appointments = JSON.parse(localStorage.getItem('tabletech_appointments_encrypted') || '[]');
      const encryptedAppointment = securityManager.encryptData({
        ...data,
        timestamp: Date.now(),
        id: securityManager.generateSecureRandomString(16)
      });
      appointments.push(encryptedAppointment);
      
      // Keep only last 10 appointments
      if (appointments.length > 10) {
        appointments.shift();
      }
      
      localStorage.setItem('tabletech_appointments_encrypted', JSON.stringify(appointments));
    }

    return response;
  } catch (error) {
    console.error('Appointment submission error:', error);
    throw error;
  }
};

export const getSecureAvailableSlots = async (date: string): Promise<AvailableSlot[]> => {
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Invalid date format');
  }

  // Check if date is in the future
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    throw new Error('Cannot book appointments in the past');
  }

  try {
    const slots = await secureApi.get<AvailableSlot[]>(
      `${APPOINTMENT_API_ENDPOINT}/slots`,
      {
        rateLimit: {
          key: 'appointment_slots',
          maxAttempts: 10,
          windowMs: 60000 // 1 minute
        }
      }
    );

    return slots;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    // Return default slots if API fails
    return generateDefaultSlots();
  }
};

export const getSecureAvailableDates = async (month: number, year: number): Promise<string[]> => {
  // Validate month and year
  if (month < 1 || month > 12) {
    throw new Error('Invalid month');
  }

  const currentYear = new Date().getFullYear();
  if (year < currentYear || year > currentYear + 2) {
    throw new Error('Invalid year');
  }

  try {
    const dates = await secureApi.get<string[]>(
      `${APPOINTMENT_API_ENDPOINT}/dates`,
      {
        rateLimit: {
          key: 'appointment_dates',
          maxAttempts: 10,
          windowMs: 60000
        }
      }
    );

    return dates;
  } catch (error) {
    console.error('Error fetching available dates:', error);
    // Return default available dates if API fails
    return generateDefaultAvailableDates(month, year);
  }
};

export const cancelSecureAppointment = async (appointmentId: string): Promise<{ success: boolean }> => {
  // Validate appointment ID format
  if (!/^[a-zA-Z0-9]{16,32}$/.test(appointmentId)) {
    throw new Error('Invalid appointment ID');
  }

  try {
    const response = await secureApi.delete<{ success: boolean }>(
      `${APPOINTMENT_API_ENDPOINT}/${appointmentId}`,
      {
        rateLimit: {
          key: `cancel_appointment_${appointmentId}`,
          maxAttempts: 3,
          windowMs: 300000 // 5 minutes
        }
      }
    );

    if (response.success) {
      // Remove from local storage
      const appointments = JSON.parse(localStorage.getItem('tabletech_appointments_encrypted') || '[]');
      const updatedAppointments = appointments.filter((encrypted: string) => {
        try {
          const decrypted = securityManager.decryptData<AppointmentData & { id?: string }>(encrypted);
          return decrypted?.id !== appointmentId;
        } catch {
          return true; // Keep if can't decrypt
        }
      });
      localStorage.setItem('tabletech_appointments_encrypted', JSON.stringify(updatedAppointments));
    }

    return response;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

export const getMyAppointments = (): AppointmentData[] => {
  try {
    const encrypted = JSON.parse(localStorage.getItem('tabletech_appointments_encrypted') || '[]');
    const appointments: AppointmentData[] = [];
    
    for (const item of encrypted) {
      try {
        const decrypted = securityManager.decryptData<AppointmentData & { timestamp: number; id: string }>(item);
        if (decrypted) {
          // Check if appointment is still valid (not in the past)
          const appointmentDate = new Date(`${decrypted.date} ${decrypted.time}`);
          if (appointmentDate > new Date()) {
            appointments.push(decrypted);
          }
        }
      } catch {
        // Skip if can't decrypt
      }
    }
    
    return appointments.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  } catch {
    return [];
  }
};

// Helper functions for fallback
function generateDefaultSlots(): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const startHour = 9;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      isAvailable: Math.random() > 0.3
    });
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:30`,
      isAvailable: Math.random() > 0.3
    });
  }
  
  return slots;
}

function generateDefaultAvailableDates(month: number, year: number): string[] {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    
    // Only future dates, exclude weekends
    if (date > today && date.getDay() !== 0 && date.getDay() !== 6) {
      // Randomly make 70% of weekdays available
      if (Math.random() > 0.3) {
        const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        dates.push(dateString);
      }
    }
  }
  
  return dates;
}

export default {
  submitSecureAppointment,
  getSecureAvailableSlots,
  getSecureAvailableDates,
  cancelSecureAppointment,
  getMyAppointments
};