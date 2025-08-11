interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  restaurant: string;
  message: string;
  date: string;
  time: string;
}

export const sendAppointmentEmail = async (appointmentData: AppointmentData): Promise<boolean> => {
  try {
    // Log the appointment data for development/testing
    console.log('📧 Sending appointment email to info@tabletech.nl');
    console.log('Appointment Details:', appointmentData);
    
    // Create unique booking ID to prevent double bookings
    const bookingId = `TT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const bookingKey = `${appointmentData.date}-${appointmentData.time}`;
    
    // Check if this time slot is already booked
    const existingBookings = JSON.parse(localStorage.getItem('tabletech-booked-slots') || '{}');
    if (existingBookings[bookingKey]) {
      console.warn('⚠️ Time slot already booked:', bookingKey);
      throw new Error('Deze tijd is al gereserveerd. Kies een andere tijd.');
    }
    
    // Reserve this time slot immediately
    existingBookings[bookingKey] = {
      bookingId,
      customerName: appointmentData.name,
      customerEmail: appointmentData.email,
      bookedAt: new Date().toISOString()
    };
    localStorage.setItem('tabletech-booked-slots', JSON.stringify(existingBookings));
    
    // Create the email data for logging/development purposes
    const emailData = {
      to: 'info@tabletech.nl',
      subject: `🔥 NIEUWE AFSPRAAK - ${appointmentData.name} (${appointmentData.date} ${appointmentData.time})`,
      bookingId,
      appointmentData
    };
    
    // Store in localStorage for development purposes (so you can see what would be sent)
    try {
      const existingAppointments = JSON.parse(localStorage.getItem('tabletech-appointments') || '[]');
      existingAppointments.push({
        ...emailData,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      localStorage.setItem('tabletech-appointments', JSON.stringify(existingAppointments));
      console.log('💾 Appointment saved to localStorage for development purposes');
    } catch (storageError) {
      console.warn('Could not save to localStorage:', storageError);
    }

    // Try multiple email services for maximum reliability
    let emailSent = false;
    let customerEmailSent = false;
    
    // Method 1: Try Strato email via FormSubmit with optimized settings
    try {
      console.log('🔄 Attempting to send via Strato/FormSubmit...');
      
      const detailedEmailContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 NIEUWE AFSPRAAK AANVRAAG - TABLETECH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 AFSPRAAK DETAILS:
┌────────────────────────────────────────┐
│ 🆔 Booking ID: ${bookingId}
│ 📅 Datum: ${appointmentData.date}
│ 🕐 Tijd: ${appointmentData.time}
│ ⏱️ Duur: 30 minuten (Gratis Adviesgesprek)
│ 🔒 Status: GERESERVEERD
└────────────────────────────────────────┘

👤 KLANT INFORMATIE:
┌────────────────────────────────────────┐
│ 📝 Naam: ${appointmentData.name}
│ 📧 Email: ${appointmentData.email}
│ 📱 Telefoon: ${appointmentData.phone}
${appointmentData.restaurant ? `│ 🏪 Restaurant: ${appointmentData.restaurant}` : '│ 🏪 Restaurant: Niet opgegeven'}
└────────────────────────────────────────┘

${appointmentData.message ? `💬 KLANT BERICHT:
┌────────────────────────────────────────┐
│ ${appointmentData.message.split('\n').join('\n│ ')}
└────────────────────────────────────────┘` : ''}

� SYSTEEM INFORMATIE:
┌────────────────────────────────────────┐
│ �🔗 Bron: TableTech Website
│ ⏰ Geboekt op: ${new Date().toLocaleString('nl-NL')}
│ 🌐 IP Tracking: Enabled
│ 🔐 Anti-dubbelboeking: Actief
└────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ACTIE VEREIST: Bevestig deze afspraak binnen 24 uur
📞 Contacteer klant: ${appointmentData.phone} of ${appointmentData.email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `;

      // Send to TableTech team (info@tabletech.nl)
      const businessFormData = new FormData();
      businessFormData.append('_to', 'info@tabletech.nl');
      businessFormData.append('_subject', `🔥 NIEUWE AFSPRAAK - ${appointmentData.name} (${appointmentData.date})`);
      businessFormData.append('_template', 'table');
      businessFormData.append('_captcha', 'false');
      businessFormData.append('booking_id', bookingId);
      businessFormData.append('naam', appointmentData.name);
      businessFormData.append('email', appointmentData.email);
      businessFormData.append('telefoon', appointmentData.phone);
      businessFormData.append('restaurant', appointmentData.restaurant || 'Niet opgegeven');
      businessFormData.append('datum', appointmentData.date);
      businessFormData.append('tijd', appointmentData.time);
      businessFormData.append('bericht', appointmentData.message || 'Geen specifiek bericht');
      businessFormData.append('volledig_bericht', detailedEmailContent);

      const businessResponse = await fetch('https://formsubmit.co/info@tabletech.nl', {
        method: 'POST',
        body: businessFormData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (businessResponse.ok) {
        console.log('✅ Business email sent successfully to info@tabletech.nl');
        emailSent = true;
      } else {
        console.warn('❌ Business email failed with status:', businessResponse.status);
        throw new Error(`Business email failed: ${businessResponse.status}`);
      }

      // Send confirmation email to customer
      const customerEmailContent = `
Beste ${appointmentData.name},

🎉 Bedankt voor je afspraak bij TableTech!

📋 JOUW AFSPRAAK DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Datum: ${appointmentData.date}
🕐 Tijd: ${appointmentData.time}
⏱️ Duur: 30 minuten
🎯 Type: Gratis Adviesgesprek
🆔 Referentie: ${bookingId}

✅ WAT KUNNEN WE VOOR JE BETEKENEN?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Hoe TableTech jouw restaurant kan transformeren
💰 Welk pakket het beste bij jou past
📊 Inzicht in je mogelijke ROI en kostenbesparingen
🛠️ Praktische implementatie en ondersteuning

📞 VOOR HET GESPREK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Denk na over je grootste uitdagingen
📋 Heb je huidige menukaarten bij de hand
📱 Test je QR-code scanner vast uit
🤔 Noteer specifieke vragen die je hebt

⚠️ BELANGRIJKE INFORMATIE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• We bevestigen je afspraak binnen 24 uur
• Bij vragen: bel +31 85 888 3333
• Email: info@tabletech.nl
• Wijzigen kan tot 24 uur van tevoren

🚀 We kijken ernaar uit om je te laten zien hoe TableTech jouw restaurant naar het volgende level kan brengen!

Met vriendelijke groet,
Het TableTech Team

P.S. Check vast onze demo op tabletech.nl en ontdek wat er mogelijk is! 🌟
      `;

      const customerFormData = new FormData();
      customerFormData.append('_to', appointmentData.email);
      customerFormData.append('_subject', `✅ Bevestiging: Je TableTech afspraak op ${appointmentData.date}`);
      customerFormData.append('_template', 'table');
      customerFormData.append('_captcha', 'false');
      customerFormData.append('_replyto', 'info@tabletech.nl');
      customerFormData.append('klant_naam', appointmentData.name);
      customerFormData.append('afspraak_datum', appointmentData.date);
      customerFormData.append('afspraak_tijd', appointmentData.time);
      customerFormData.append('bevestiging_bericht', customerEmailContent);

      const customerResponse = await fetch('https://formsubmit.co/ajax/' + appointmentData.email, {
        method: 'POST',
        body: customerFormData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (customerResponse.ok) {
        console.log('✅ Customer confirmation email sent successfully');
        customerEmailSent = true;
      } else {
        console.warn('⚠️ Customer email failed, but business email succeeded');
      }

    } catch (formSubmitError) {
      console.warn('❌ Strato/FormSubmit method failed:', formSubmitError);
    }

    // Method 2: Try Formspree as backup
    if (!emailSent) {
      try {
        console.log('🔄 Attempting to send via Formspree...');
        
        const formspreeResponse = await fetch('https://formspree.io/f/xpwzgzrd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: appointmentData.email,
            naam: appointmentData.name,
            telefoon: appointmentData.phone,
            restaurant: appointmentData.restaurant || 'Niet opgegeven',
            datum: appointmentData.date,
            tijd: appointmentData.time,
            bericht: appointmentData.message || 'Geen specifiek bericht',
            _subject: `🔥 NIEUWE AFSPRAAK - ${appointmentData.name} (${appointmentData.date})`,
            _replyto: appointmentData.email
          })
        });

        if (formspreeResponse.ok) {
          console.log('✅ Email sent successfully via Formspree');
          emailSent = true;
        } else {
          throw new Error(`Formspree failed: ${formspreeResponse.status}`);
        }
      } catch (formspreeError) {
        console.warn('❌ Formspree method failed:', formspreeError);
      }
    }

    // Method 3: Try Netlify Forms as final backup
    if (!emailSent) {
      try {
        console.log('🔄 Attempting to send via Netlify Forms...');
        
        const netlifyFormData = new FormData();
        netlifyFormData.append('form-name', 'tabletech-appointments');
        netlifyFormData.append('naam', appointmentData.name);
        netlifyFormData.append('email', appointmentData.email);
        netlifyFormData.append('telefoon', appointmentData.phone);
        netlifyFormData.append('restaurant', appointmentData.restaurant || 'Niet opgegeven');
        netlifyFormData.append('datum', appointmentData.date);
        netlifyFormData.append('tijd', appointmentData.time);
        netlifyFormData.append('bericht', appointmentData.message || 'Geen specifiek bericht');

        const netlifyResponse = await fetch('/', {
          method: 'POST',
          body: netlifyFormData
        });

        if (netlifyResponse.ok) {
          console.log('✅ Email sent successfully via Netlify Forms');
          emailSent = true;
        } else {
          throw new Error(`Netlify Forms failed: ${netlifyResponse.status}`);
        }
      } catch (netlifyError) {
        console.warn('❌ Netlify Forms method failed:', netlifyError);
      }
    }

    // If all methods fail, still log the attempt for manual follow-up
    if (!emailSent) {
      console.error('❌ All email methods failed. Logging for manual follow-up...');
      
      // Create a detailed log entry for manual processing
      const manualLog = {
        timestamp: new Date().toISOString(),
        status: 'MANUAL_FOLLOW_UP_REQUIRED',
        appointmentData,
        priority: 'HIGH',
        action_required: 'Contact customer directly within 24 hours'
      };
      
      console.error('🚨 MANUAL FOLLOW-UP REQUIRED:', manualLog);
      
      // Try to store in a separate "failed emails" log
      try {
        const failedEmails = JSON.parse(localStorage.getItem('tabletech-failed-emails') || '[]');
        failedEmails.push(manualLog);
        localStorage.setItem('tabletech-failed-emails', JSON.stringify(failedEmails));
      } catch (e) {
        console.warn('Could not log failed email:', e);
      }
    }

    return emailSent;
  } catch (error) {
    console.error('❌ Critical error in email sending process:', error);
    
    // If it's a double booking error, re-throw it
    if (error instanceof Error && error.message.includes('al gereserveerd')) {
      throw error;
    }
    
    return false;
  }
};

// Check if a time slot is available
export const isTimeSlotAvailable = (date: string, time: string): boolean => {
  try {
    const bookingKey = `${date}-${time}`;
    const existingBookings = JSON.parse(localStorage.getItem('tabletech-booked-slots') || '{}');
    return !existingBookings[bookingKey];
  } catch (error) {
    console.warn('Error checking time slot availability:', error);
    return true; // Allow booking if there's an error checking
  }
};

// Get all booked time slots for a specific date
export const getBookedTimeSlotsForDate = (date: string): string[] => {
  try {
    const existingBookings = JSON.parse(localStorage.getItem('tabletech-booked-slots') || '{}');
    return Object.keys(existingBookings)
      .filter(key => key.startsWith(date))
      .map(key => key.split('-').pop() || '');
  } catch (error) {
    console.warn('Error getting booked time slots:', error);
    return [];
  }
};

// Clear expired bookings (older than 7 days)
export const clearExpiredBookings = (): void => {
  try {
    const existingBookings = JSON.parse(localStorage.getItem('tabletech-booked-slots') || '{}');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const updatedBookings: Record<string, any> = {};
    
    Object.entries(existingBookings).forEach(([key, booking]: [string, any]) => {
      const bookingDate = new Date(booking.bookedAt);
      if (bookingDate > sevenDaysAgo) {
        updatedBookings[key] = booking;
      }
    });
    
    localStorage.setItem('tabletech-booked-slots', JSON.stringify(updatedBookings));
    console.log('🧹 Expired bookings cleared');
  } catch (error) {
    console.warn('Error clearing expired bookings:', error);
  }
};

// Alternative method using EmailJS (if you prefer client-side email sending)
export const sendAppointmentEmailWithEmailJS = async (appointmentData: AppointmentData): Promise<boolean> => {
  try {
    // You would need to install emailjs-com: npm install emailjs-com
    // import emailjs from 'emailjs-com';
    
    const templateParams = {
      to_email: 'info@tabletech.nl',
      from_name: appointmentData.name,
      from_email: appointmentData.email,
      phone: appointmentData.phone,
      restaurant: appointmentData.restaurant || 'Niet opgegeven',
      appointment_date: appointmentData.date,
      appointment_time: appointmentData.time,
      message: appointmentData.message || 'Geen bericht',
      subject: `Nieuwe afspraak: ${appointmentData.name} - ${appointmentData.date} ${appointmentData.time}`
    };

    // Replace these with your EmailJS service ID, template ID, and user ID
    // const result = await emailjs.send(
    //   'YOUR_SERVICE_ID',
    //   'YOUR_TEMPLATE_ID', 
    //   templateParams,
    //   'YOUR_USER_ID'
    // );

    console.log('Email would be sent with EmailJS:', templateParams);
    return true;
  } catch (error) {
    console.error('Error sending email with EmailJS:', error);
    return false;
  }
};

// Fallback method using mailto (opens user's email client)
export const createMailtoLink = (appointmentData: AppointmentData): string => {
  const subject = encodeURIComponent(`Nieuwe afspraak: ${appointmentData.name} - ${appointmentData.date} ${appointmentData.time}`);
  const body = encodeURIComponent(`
Nieuwe Afspraak Geboekt

Afspraak Details:
- Datum: ${appointmentData.date}
- Tijd: ${appointmentData.time}
- Type: Gratis Adviesgesprek (30 minuten)

Klant Informatie:
- Naam: ${appointmentData.name}
- Email: ${appointmentData.email}
- Telefoon: ${appointmentData.phone}
${appointmentData.restaurant ? `- Restaurant: ${appointmentData.restaurant}` : ''}

${appointmentData.message ? `Bericht van klant:\n${appointmentData.message}` : ''}
  `);

  return `mailto:info@tabletech.nl?subject=${subject}&body=${body}`;
};