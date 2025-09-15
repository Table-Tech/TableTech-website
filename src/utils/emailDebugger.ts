// EmailDebugger - Tool om email delivery issues te debuggen
// Voeg dit toe aan je browser console om email logs te bekijken

interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  restaurant: string;
  message: string;
  date: string;
  time: string;
}

interface FailedBooking {
  timestamp: string;
  appointmentData: AppointmentData;
  status: string;
  priority: string;
  action_required: string;
}

export const EmailDebugger = {
  // Bekijk alle opgeslagen afspraken
  getStoredAppointments: () => {
    try {
      const appointments = localStorage.getItem('tabletech-appointments');
      const parsed = appointments ? JSON.parse(appointments) : [];
      // Stored appointments retrieved
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Error reading stored appointments
      return [];
    }
  },

  // Bekijk mislukte email verzendingen
  getFailedEmails: () => {
    try {
      const failed = localStorage.getItem('tabletech-failed-emails');
      const parsed = failed ? JSON.parse(failed) : [];
      // Failed emails retrieved
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Error reading failed emails
      return [];
    }
  },

  // Bekijk mislukte boekingen
  getFailedBookings: (): FailedBooking[] => {
    try {
      const failed = localStorage.getItem('tabletech-failed-bookings');
      const parsed = failed ? JSON.parse(failed) : [];
      // Failed bookings retrieved
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Error reading failed bookings
      return [];
    }
  },

  // Test email functionaliteit
  testEmailService: async () => {
    // Testing email service
    
    const testData: AppointmentData = {
      name: 'Test Gebruiker',
      email: 'test@example.com',
      phone: '06-12345678',
      restaurant: 'Test Restaurant',
      message: 'Dit is een test bericht',
      date: new Date().toLocaleDateString('nl-NL'),
      time: '14:00'
    };

    try {
      const { sendAppointmentEmail } = await import('../services/emailService');
      const result = await sendAppointmentEmail(testData);
      
      if (result) {
        // Email test successful
      } else {
        // Email test failed
      }
      
      return result;
    } catch {
      // Email test error
      return false;
    }
  },

  // Krijg een overzicht van alle logs
  getAllLogs: () => {
    // Generating complete email debug report
    
    const appointments = EmailDebugger.getStoredAppointments() || [];
    const failedEmails = EmailDebugger.getFailedEmails() || [];
    const failedBookings = EmailDebugger.getFailedBookings() || [];
    
    // Email statistics calculated
    
    if (failedBookings.length > 0) {
      // Manual follow-up required for failed bookings
    }
    
    return {
      appointments,
      failedEmails,
      failedBookings,
      successRate: appointments.length > 0 ? ((appointments.length - failedEmails.length) / appointments.length * 100).toFixed(1) : 0
    };
  },

  // Clear all logs (gebruik voorzichtig!)
  clearAllLogs: () => {
    if (confirm('🗑️ Are you sure you want to clear ALL email logs? This cannot be undone!')) {
      localStorage.removeItem('tabletech-appointments');
      localStorage.removeItem('tabletech-failed-emails');
      localStorage.removeItem('tabletech-failed-bookings');
      // All logs cleared
    }
  },

  // Export logs voor support
  exportLogs: () => {
    const logs = EmailDebugger.getAllLogs();
    const exportData = {
      exportDate: new Date().toISOString(),
      website: 'TableTech',
      ...logs
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tabletech-email-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Logs exported successfully
  }
};

// Maak het globaal beschikbaar in de browser console
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).EmailDebugger = EmailDebugger;
  // EmailDebugger loaded
}

export default EmailDebugger;
