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
    console.log('📧 Sending Strato-optimized email to info@tabletech.nl');
    
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

    let emailSent = false;
    
    // Method 1: Direct AJAX call to FormSubmit (best for Strato)
    try {
      console.log('🔄 Attempting Strato-optimized FormSubmit AJAX...');
      
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
        console.log('✅ Strato email sent successfully!', result);
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
            message: `Beste ${appointmentData.name},\n\nJe afspraak is bevestigd!\n\nDatum: ${appointmentData.date}\nTijd: ${appointmentData.time}\nReferentie: ${bookingId}\n\nWe nemen binnen 24 uur contact met je op.\n\nMet vriendelijke groet,\nTeam TableTech`,
            _replyto: 'info@tabletech.nl',
            _template: 'box',
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
            console.log('✅ Customer confirmation sent');
          }
        } catch (customerError) {
          console.warn('⚠️ Customer email failed:', customerError);
        }
        
      } else {
        throw new Error(`FormSubmit AJAX failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('❌ FormSubmit AJAX failed:', error);
    }

    // Method 2: Netlify Forms as backup
    if (!emailSent) {
      try {
        console.log('🔄 Trying Netlify Forms backup...');
        
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
          console.log('✅ Netlify backup email sent');
          emailSent = true;
        }
      } catch (netlifyError) {
        console.warn('❌ Netlify backup failed:', netlifyError);
      }
    }

    // Method 3: Formspree as final backup
    if (!emailSent) {
      try {
        console.log('🔄 Trying Formspree final backup...');
        
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
          console.log('✅ Formspree backup email sent');
          emailSent = true;
        }
      } catch (formspreeError) {
        console.warn('❌ Formspree backup failed:', formspreeError);
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
      console.warn('Storage error:', storageError);
    }

    return emailSent;
  } catch (error) {
    console.error('❌ Critical error in Strato email service:', error);
    
    // If it's a double booking error, re-throw it
    if (error instanceof Error && error.message.includes('al gereserveerd')) {
      throw error;
    }
    
    return false;
  }
};
