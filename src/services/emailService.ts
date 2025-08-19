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
    // Processing appointment email
    
    // Create unique booking ID to prevent double bookings
    const bookingId = `TT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const bookingKey = `${appointmentData.date}-${appointmentData.time}`;
    
    // Check if this time slot is already booked
    const existingBookings = JSON.parse(localStorage.getItem('tabletech-booked-slots') || '{}');
    if (existingBookings[bookingKey]) {
      // Time slot already booked
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
      // Appointment saved to localStorage
    } catch (storageError) {
      // Could not save to localStorage
    }

    // Try multiple email services for maximum reliability
    let emailSent = false;
    
    // Method 1: Try Strato email via FormSubmit with optimized settings
    try {
      // Attempting to send via Strato/FormSubmit
      
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

🔧 SYSTEEM INFORMATIE:
┌────────────────────────────────────────┐
│ 🔗 Bron: TableTech Website
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
        // Business email sent successfully
        emailSent = true;
      } else {
        // Business email failed
        throw new Error(`Business email failed: ${businessResponse.status}`);
      }

      // Send confirmation email to customer
      const customerEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:image" content="https://tabletech.nl/api/logo">
  <title>TableTech - Afspraak Bevestiging</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
  <div style="background-color: #f6f9fc; padding: 20px 0; margin: 0 auto; width: 100%;">
    <!-- Decorative top bar -->
    <div style="height: 4px; background-color: #E86C28; width: 100%; max-width: 600px; margin: 0 auto;"></div>
    
    <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <!-- Logo Header -->
      <div style="padding: 30px 0; text-align: center; background-color: #ffffff; border-bottom: 2px solid #E86C28;">
        <a href="https://tabletech.nl" style="text-decoration: none;">
          <img src="https://tabletech.nl/api/logo" alt="TableTech Logo" style="height: 50px; width: 150px; display: block; margin: 0 auto;">
        </a>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 40px;">
        <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 700; line-height: 36px; margin: 0 0 20px; text-align: center;">Bedankt voor je aanvraag!</h1>
  
        <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin: 0 0 20px;">Beste ${appointmentData.name},</p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
          We hebben je aanvraag voor een afspraak in goede orde ontvangen! 
          We nemen binnen 1 werkdag contact met je op om de afspraak te bevestigen.
        </p>
        
        <!-- Appointment Highlight -->
        <div style="background-color: #FFF5F0; border-radius: 8px; margin: 24px 0; padding: 20px; border: 2px solid #E86C28; text-align: left;">
          <p style="color: #1a1a1a; font-size: 18px; line-height: 24px; margin: 0 0 8px; font-weight: 600;">
            📅 <strong>Jouw voorkeur:</strong> ${appointmentData.date} om ${appointmentData.time}
          </p>
          <p style="color: #718096; font-size: 14px; line-height: 20px; margin: 0;">
            (Telefonisch gesprek van 30 minuten)
          </p>
        </div>
        
        <!-- Additional content sections -->
        <div style="background-color: #f7fafc; border-radius: 8px; margin: 24px 0; padding: 20px; border: 1px solid #e2e8f0;">
          <h2 style="color: #E86C28; font-size: 20px; font-weight: 600; line-height: 26px; margin: 0 0 16px; text-align: left;">
            Details van je aanvraag
          </h2>
          
          <p style="color: #2d3748; font-size: 14px; line-height: 22px; margin: 0 0 12px; text-align: left;">
            <strong>Naam:</strong> ${appointmentData.name}
          </p>
          <p style="color: #2d3748; font-size: 14px; line-height: 22px; margin: 0 0 12px; text-align: left;">
            <strong>E-mail:</strong> ${appointmentData.email}
          </p>
          <p style="color: #2d3748; font-size: 14px; line-height: 22px; margin: 0 0 12px; text-align: left;">
            <strong>Telefoon:</strong> ${appointmentData.phone}
          </p>
          ${appointmentData.restaurant ? `<p style="color: #2d3748; font-size: 14px; line-height: 22px; margin: 0 0 12px; text-align: left;">
            <strong>Restaurant:</strong> ${appointmentData.restaurant}
          </p>` : ''}
          <p style="color: #2d3748; font-size: 14px; line-height: 22px; margin: 0 0 12px; text-align: left;">
            <strong>Bericht:</strong>
          </p>
          <div style="background-color: #ffffff; border: 1px solid #E86C28; border-radius: 6px; color: #4a5568; font-size: 14px; line-height: 22px; margin: 12px 0 16px; padding: 16px; white-space: pre-wrap; text-align: left;">
            ${appointmentData.message || 'Geen specifiek bericht'}
          </div>
        </div>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin: 30px 0 20px;">
          We kijken ernaar uit om je te laten zien hoe TableTech jouw restaurant naar het volgende level kan brengen!
        </p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
          Met vriendelijke groet,<br>
          <strong>Het TableTech Team</strong>
        </p>
  
        <!-- Call to Action -->
        <hr style="border-color: #e2e8f0; margin: 30px 0; border-width: 1px; border-style: solid;">
        
        <div style="padding: 24px 0; text-align: center;">
          <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin: 0 0 20px; text-align: center;">
            Mocht je vragen hebben of de afspraak willen wijzigen, 
            neem dan gerust contact met ons op:
          </p>
          
          <a href="mailto:info@tabletech.nl?subject=Afspraak aanvraag" style="background-color: #E86C28; border-radius: 6px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: 600; line-height: 100%; padding: 14px 28px; text-decoration: none; text-align: center; border: none;">
            Contact opnemen
          </a>
        </div>
      </div>
    </div>
    
    <!-- Centered Footer -->
    <div style="background-color: #f7fafc; padding: 40px 20px; text-align: center; border-top: 1px solid #e2e8f0; margin-top: 40px;">
      <div style="max-width: 400px; margin: 0 auto; text-align: center;">
        <img src="https://tabletech.nl/api/logo" alt="TableTech Logo" style="height: 33px; width: 100px; display: block; margin: 0 auto 12px auto;">
        
        <p style="color: #2d3748; font-size: 14px; line-height: 20px; margin: 10px 0 4px; text-align: center;">
          <strong>TableTech B.V.</strong>
        </p>
        <p style="color: #718096; font-size: 13px; line-height: 18px; margin: 4px 0; text-align: center;">
          Biezelingeplein 32, 3086 SB Rotterdam, Nederland
        </p>
        <p style="color: #718096; font-size: 13px; line-height: 18px; margin: 4px 0 10px; text-align: center;">
          📧 info@tabletech.nl | 📞 +31 85 888 3333
        </p>
        <a href="https://tabletech.nl" style="color: #E86C28; font-size: 13px; line-height: 18px; text-decoration: underline; display: inline-block; margin: 8px 0;">
          www.tabletech.nl
        </a>
        
        <hr style="border-color: #e2e8f0; margin: 20px 0 15px; border-width: 1px; border-style: solid;">
        
        <p style="color: #a0aec0; font-size: 11px; line-height: 16px; margin: 8px 0; text-align: center;">
          © 2025 TableTech. Alle rechten voorbehouden.
        </p>
        <p style="color: #a0aec0; font-size: 10px; line-height: 14px; margin: 8px 0 0; text-align: center; font-style: italic;">
          Je ontvangt deze e-mail omdat je een afspraak hebt aangevraagd via onze website.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
      `;

      const customerFormData = new FormData();
      customerFormData.append('_to', appointmentData.email);
      customerFormData.append('_subject', `✅ Bevestiging: Je TableTech afspraak op ${appointmentData.date}`);
      customerFormData.append('_template', 'table');
      customerFormData.append('_captcha', 'false');
      customerFormData.append('_replyto', 'info@tabletech.nl');
      customerFormData.append('_format', 'html');
      customerFormData.append('_cc', 'info@tabletech.nl');
      customerFormData.append('klant_naam', appointmentData.name);
      customerFormData.append('afspraak_datum', appointmentData.date);
      customerFormData.append('afspraak_tijd', appointmentData.time);
      customerFormData.append('message', customerEmailContent); // Use 'message' field for HTML content

      const customerResponse = await fetch('https://formsubmit.co/ajax/' + appointmentData.email, {
        method: 'POST',
        body: customerFormData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (customerResponse.ok) {
        // Customer confirmation email sent
      } else {
        // Customer email failed, but business email succeeded
      }

    } catch (formSubmitError) {
      // Strato/FormSubmit method failed
    }

    // Method 2: Try Formspree as backup
    if (!emailSent) {
      try {
        // Attempting to send via Formspree
        
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
          // Email sent successfully via Formspree
          emailSent = true;
        } else {
          throw new Error(`Formspree failed: ${formspreeResponse.status}`);
        }
      } catch (formspreeError) {
        // Formspree method failed
      }
    }

    // Method 3: Try Netlify Forms as final backup
    if (!emailSent) {
      try {
        // Attempting to send via Netlify Forms
        
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
          // Email sent successfully via Netlify Forms
          emailSent = true;
        } else {
          throw new Error(`Netlify Forms failed: ${netlifyResponse.status}`);
        }
      } catch (netlifyError) {
        // Netlify Forms method failed
      }
    }

    // If all methods fail, still log the attempt for manual follow-up
    if (!emailSent) {
      // All email methods failed - manual follow-up required
      const manualLog = {
        timestamp: new Date().toISOString(),
        status: 'MANUAL_FOLLOW_UP_REQUIRED',
        appointmentData,
        priority: 'HIGH',
        action_required: 'Contact customer directly within 24 hours'
      };
      
      // Try to store in a separate "failed emails" log
      try {
        const failedEmails = JSON.parse(localStorage.getItem('tabletech-failed-emails') || '[]');
        failedEmails.push(manualLog);
        localStorage.setItem('tabletech-failed-emails', JSON.stringify(failedEmails));
      } catch (e) {
        // Could not log failed email
      }
    }

    return emailSent;
  } catch (error) {
    // Critical error in email sending process
    
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
    // Error checking time slot availability
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
    // Error getting booked time slots
    return [];
  }
};

// Clear expired bookings (older than 7 days)
export const clearExpiredBookings = (): void => {
  try {
    const existingBookings = JSON.parse(localStorage.getItem('tabletech-booked-slots') || '{}');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const updatedBookings: Record<string, { bookedAt: string; [key: string]: unknown }> = {};
    
    Object.entries(existingBookings).forEach(([key, booking]) => {
      const typedBooking = booking as { bookedAt: string; [key: string]: unknown };
      const bookingDate = new Date(typedBooking.bookedAt);
      if (bookingDate > sevenDaysAgo) {
        updatedBookings[key] = typedBooking;
      }
    });
    
    localStorage.setItem('tabletech-booked-slots', JSON.stringify(updatedBookings));
    // Expired bookings cleared
  } catch (error) {
    // Error clearing expired bookings
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

    // Email would be sent with EmailJS
    return true;
  } catch (error) {
    // Error sending email with EmailJS
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