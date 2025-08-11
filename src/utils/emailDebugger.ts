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
  action: string;
}

export const EmailDebugger = {
  // Bekijk alle opgeslagen afspraken
  getStoredAppointments: () => {
    try {
      const appointments = localStorage.getItem('tabletech-appointments');
      const parsed = appointments ? JSON.parse(appointments) : [];
      console.log('📋 Stored Appointments:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error reading stored appointments:', error);
      return [];
    }
  },

  // Bekijk mislukte email verzendingen
  getFailedEmails: () => {
    try {
      const failed = localStorage.getItem('tabletech-failed-emails');
      const parsed = failed ? JSON.parse(failed) : [];
      console.log('❌ Failed Emails:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error reading failed emails:', error);
      return [];
    }
  },

  // Bekijk mislukte boekingen
  getFailedBookings: (): FailedBooking[] => {
    try {
      const failed = localStorage.getItem('tabletech-failed-bookings');
      const parsed = failed ? JSON.parse(failed) : [];
      console.log('🚨 Failed Bookings requiring manual follow-up:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error reading failed bookings:', error);
      return [];
    }
  },

  // Test email functionaliteit
  testEmailService: async () => {
    console.log('🧪 Testing email service...');
    
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
        console.log('✅ Email test successful!');
      } else {
        console.log('❌ Email test failed!');
      }
      
      return result;
    } catch (error) {
      console.error('🚨 Email test error:', error);
      return false;
    }
  },

  // Krijg een overzicht van alle logs
  getAllLogs: () => {
    console.log('📊 Complete Email Debug Report:');
    console.log('='.repeat(50));
    
    const appointments = EmailDebugger.getStoredAppointments();
    const failedEmails = EmailDebugger.getFailedEmails();
    const failedBookings = EmailDebugger.getFailedBookings();
    
    console.log(`📈 Statistics:
    - Total appointments: ${appointments.length}
    - Failed emails: ${failedEmails.length}
    - Failed bookings: ${failedBookings.length}
    - Success rate: ${appointments.length > 0 ? ((appointments.length - failedEmails.length) / appointments.length * 100).toFixed(1) : 0}%`);
    
    if (failedBookings.length > 0) {
      console.log('\n🚨 URGENT: Manual follow-up required for these customers:');
      failedBookings.forEach((booking: FailedBooking, index: number) => {
        console.log(`${index + 1}. ${booking.appointmentData.name} - ${booking.appointmentData.email} - ${booking.appointmentData.phone}`);
        console.log(`   Appointment: ${booking.appointmentData.date} at ${booking.appointmentData.time}`);
        console.log(`   Failed at: ${new Date(booking.timestamp).toLocaleString('nl-NL')}`);
      });
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
      console.log('✅ All logs cleared!');
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
    
    console.log('📁 Logs exported successfully!');
  }
};

// Maak het globaal beschikbaar in de browser console
if (typeof window !== 'undefined') {
  (window as any).EmailDebugger = EmailDebugger;
  console.log('🔧 EmailDebugger loaded! Use EmailDebugger.getAllLogs() to see email statistics.');
}

export default EmailDebugger;
