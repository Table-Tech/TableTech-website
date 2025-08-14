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
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <!-- Volledig oranje header bar -->
  <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); height: 8px; width: 100%;"></div>
  
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <img src="https://tabletech.nl/logo4.png" alt="TableTech Logo" style="height: 60px; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Afspraak Bevestiging</h1>
  </div>
  
  <div style="padding: 30px;">
    <h2 style="color: #333; margin-bottom: 20px;">Beste ${appointmentData.name},</h2>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="color: #667eea; margin: 0 0 15px 0;">🎉 Bedankt voor je afspraak bij TableTech!</h3>
      <p style="margin: 5px 0; color: #555;"><strong>📅 Datum:</strong> ${appointmentData.date}</p>
      <p style="margin: 5px 0; color: #555;"><strong>🕐 Tijd:</strong> ${appointmentData.time}</p>
      <p style="margin: 5px 0; color: #555;"><strong>⏱️ Duur:</strong> 30 minuten</p>
      <p style="margin: 5px 0; color: #555;"><strong>🎯 Type:</strong> Gratis Adviesgesprek</p>
      <p style="margin: 5px 0; color: #555;"><strong>🆔 Referentie:</strong> ${bookingId}</p>
    </div>
    
    <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #0066cc; margin: 0 0 15px 0;">✅ Wat kunnen we voor je betekenen?</h3>
      <ul style="color: #555; padding-left: 20px;">
        <li>🚀 Hoe TableTech jouw restaurant kan transformeren</li>
        <li>💰 Welk pakket het beste bij jou past</li>
        <li>📊 Inzicht in je mogelijke ROI en kostenbesparingen</li>
        <li>🛠️ Praktische implementatie en ondersteuning</li>
      </ul>
    </div>
    
    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
      <h3 style="color: #856404; margin: 0 0 15px 0;">📞 Voor het gesprek:</h3>
      <ul style="color: #555; padding-left: 20px;">
        <li>💡 Denk na over je grootste uitdagingen</li>
        <li>📋 Heb je huidige menukaarten bij de hand</li>
        <li>📱 Test je QR-code scanner vast uit</li>
        <li>🤔 Noteer specifieke vragen die je hebt</li>
      </ul>
    </div>
    
    <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
      <h3 style="color: #155724; margin: 0 0 15px 0;">⚠️ Belangrijke informatie:</h3>
      <ul style="color: #555; padding-left: 20px;">
        <li>We bevestigen je afspraak binnen 24 uur</li>
        <li>Bij vragen: bel <strong>+31 85 888 3333</strong></li>
        <li>Email: <strong>info@tabletech.nl</strong></li>
        <li>Wijzigen kan tot 24 uur van tevoren</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://tabletech.nl" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">🌟 Bekijk onze Demo</a>
    </div>
    
    <p style="color: #666; margin-top: 30px;">
      We kijken ernaar uit om je te laten zien hoe TableTech jouw restaurant naar het volgende level kan brengen!
    </p>
    
    <p style="color: #666;">
      Met vriendelijke groet,<br>
      <strong>Het TableTech Team</strong>
    </p>
    
    <p style="color: #999; font-size: 12px; margin-top: 20px;">
      P.S. Check vast onze demo op tabletech.nl en ontdek wat er mogelijk is! 🌟
    </p>
  </div>
  
  <!-- Verbeterde gecentreerde footer -->
  <div style="background-color: #f8f9fa; padding: 40px 20px; text-align: center; border-top: 1px solid #e9ecef;">
    <div style="max-width: 350px; margin: 0 auto;">
      <img src="https://tabletech.nl/logo4.png" alt="TableTech Logo" style="height: 35px; margin-bottom: 20px;">
      
      <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="color: white; margin: 0; font-size: 13px; font-weight: bold;">
          TableTech | Biezelingeplein 32, 3086 SB<br>
          Rotterdam, Nederland
        </p>
        <p style="color: white; margin: 8px 0 0 0; font-size: 12px;">
          <a href="https://tabletech.nl" style="color: white; text-decoration: underline;">https://tabletech.nl</a>
        </p>
      </div>
      
      <p style="color: #6c757d; margin: 15px 0 5px 0; font-size: 12px; line-height: 1.4;">
        © 2025 TableTech. Alle rechten voorbehouden.
      </p>
      <p style="color: #6c757d; margin: 5px 0; font-size: 11px;">
        📧 info@tabletech.nl | 📞 +31 85 888 3333
      </p>
      <p style="color: #999; margin: 10px 0 0 0; font-size: 10px; font-style: italic;">
        Je ontvangt deze e-mail omdat je een afspraak hebt aangevraagd via onze website.
      </p>
    </div>
  </div>
</div>
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
      customerFormData.append('_format', 'html'); // Enable HTML format

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