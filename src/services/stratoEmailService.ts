interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  restaurant: string;
  message: string;
  date: string;
  time: string;
}

// Enhanced email service specifically optimized for Strato hosting
export const sendAppointmentEmailStrato = async (appointmentData: AppointmentData): Promise<boolean> => {
  try {
    // Sending Strato-optimized email
    
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

    let emailSent = false;
    
    // Method 1: Direct AJAX call to FormSubmit (best for Strato)
    try {
      // Attempting Strato-optimized FormSubmit AJAX
      
      const emailPayload = {
        _subject: `🔥 NIEUWE AFSPRAAK - ${appointmentData.name} (${appointmentData.date} ${appointmentData.time})`,
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        restaurant: appointmentData.restaurant || 'Niet opgegeven',
        date: appointmentData.date,
        time: appointmentData.time,
        message: appointmentData.message || 'Geen specifiek bericht',
        booking_id: bookingId,
        booking_timestamp: new Date().toLocaleString('nl-NL'),
        source: 'TableTech Website',
        _template: 'box',
        _captcha: false,
        _next: 'https://tabletech.nl/thanks',
        _replyto: appointmentData.email,
        _cc: appointmentData.email
      };

      const response = await fetch('https://formsubmit.co/ajax/info@tabletech.nl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      if (response.ok) {
        const result = await response.json();
        // Strato email sent successfully
        emailSent = true;
        
        // Send customer confirmation
        try {
          const customerPayload = {
            _subject: `✅ Bevestiging TableTech afspraak - ${appointmentData.date}`,
            to: appointmentData.email,
            from: 'TableTech <info@tabletech.nl>',
            customer_name: appointmentData.name,
            appointment_date: appointmentData.date,
            appointment_time: appointmentData.time,
            restaurant: appointmentData.restaurant || 'Niet opgegeven',
            phone: appointmentData.phone,
            booking_reference: bookingId,
            message: `
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
      <h3 style="color: #667eea; margin: 0 0 15px 0;">🎉 Je afspraak is bevestigd!</h3>
      <p style="margin: 5px 0; color: #555;"><strong>📅 Datum:</strong> ${appointmentData.date}</p>
      <p style="margin: 5px 0; color: #555;"><strong>🕐 Tijd:</strong> ${appointmentData.time}</p>
      <p style="margin: 5px 0; color: #555;"><strong>⏱️ Duur:</strong> 30 minuten</p>
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
</div>`,
            _replyto: 'info@tabletech.nl',
            _template: 'table',
            _format: 'html',
            _captcha: false
          };

          const customerResponse = await fetch(`https://formsubmit.co/ajax/${appointmentData.email}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(customerPayload)
          });

          if (customerResponse.ok) {
            // Customer confirmation sent
          }
        } catch (customerError) {
          // Customer email failed
        }
        
      } else {
        throw new Error(`FormSubmit AJAX failed: ${response.status}`);
      }
    } catch (error) {
      // FormSubmit AJAX failed
    }

    // Method 2: Netlify Forms as backup
    if (!emailSent) {
      try {
        // Trying Netlify Forms backup
        
        const netlifyFormData = new FormData();
        netlifyFormData.append('form-name', 'tabletech-appointments');
        netlifyFormData.append('name', appointmentData.name);
        netlifyFormData.append('email', appointmentData.email);
        netlifyFormData.append('phone', appointmentData.phone);
        netlifyFormData.append('restaurant', appointmentData.restaurant || 'Niet opgegeven');
        netlifyFormData.append('date', appointmentData.date);
        netlifyFormData.append('time', appointmentData.time);
        netlifyFormData.append('message', appointmentData.message || 'Geen specifiek bericht');
        netlifyFormData.append('booking_id', bookingId);

        const netlifyResponse = await fetch('/', {
          method: 'POST',
          body: netlifyFormData
        });

        if (netlifyResponse.ok) {
          // Netlify backup email sent
          emailSent = true;
        }
      } catch (netlifyError) {
        // Netlify backup failed
      }
    }

    // Method 3: Formspree as final backup
    if (!emailSent) {
      try {
        // Trying Formspree final backup
        
        const formspreeResponse = await fetch('https://formspree.io/f/xpwzgzrd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: appointmentData.name,
            email: appointmentData.email,
            phone: appointmentData.phone,
            restaurant: appointmentData.restaurant || 'Niet opgegeven',
            date: appointmentData.date,
            time: appointmentData.time,
            message: appointmentData.message || 'Geen specifiek bericht',
            booking_id: bookingId,
            _subject: `🔥 NIEUWE AFSPRAAK - ${appointmentData.name} (${appointmentData.date})`,
            _replyto: appointmentData.email
          })
        });

        if (formspreeResponse.ok) {
          // Formspree backup email sent
          emailSent = true;
        }
      } catch (formspreeError) {
        // Formspree backup failed
      }
    }

    // Store appointment data for logging
    try {
      const appointments = JSON.parse(localStorage.getItem('tabletech-appointments') || '[]');
      appointments.push({
        bookingId,
        appointmentData,
        emailSent,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('tabletech-appointments', JSON.stringify(appointments));
    } catch (storageError) {
      // Storage error
    }

    return emailSent;
  } catch (error) {
    // Critical error in Strato email service
    
    // If it's a double booking error, re-throw it
    if (error instanceof Error && error.message.includes('al gereserveerd')) {
      throw error;
    }
    
    return false;
  }
};
