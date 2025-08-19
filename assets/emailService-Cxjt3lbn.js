const p=async e=>{try{const i=`TT-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,l=`${e.date}-${e.time}`,a=JSON.parse(localStorage.getItem("tabletech-booked-slots")||"{}");if(a[l])throw new Error("Deze tijd is al gereserveerd. Kies een andere tijd.");a[l]={bookingId:i,customerName:e.name,customerEmail:e.email,bookedAt:new Date().toISOString()},localStorage.setItem("tabletech-booked-slots",JSON.stringify(a));const d={to:"info@tabletech.nl",subject:`🔥 NIEUWE AFSPRAAK - ${e.name} (${e.date} ${e.time})`,bookingId:i,appointmentData:e};try{const t=JSON.parse(localStorage.getItem("tabletech-appointments")||"[]");t.push({...d,timestamp:new Date().toISOString(),id:Date.now()}),localStorage.setItem("tabletech-appointments",JSON.stringify(t))}catch{}let n=!1;try{const t=`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 NIEUWE AFSPRAAK AANVRAAG - TABLETECH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 AFSPRAAK DETAILS:
┌────────────────────────────────────────┐
│ 🆔 Booking ID: ${i}
│ 📅 Datum: ${e.date}
│ 🕐 Tijd: ${e.time}
│ ⏱️ Duur: 30 minuten (Gratis Adviesgesprek)
│ 🔒 Status: GERESERVEERD
└────────────────────────────────────────┘

👤 KLANT INFORMATIE:
┌────────────────────────────────────────┐
│ 📝 Naam: ${e.name}
│ 📧 Email: ${e.email}
│ 📱 Telefoon: ${e.phone}
${e.restaurant?`│ 🏪 Restaurant: ${e.restaurant}`:"│ 🏪 Restaurant: Niet opgegeven"}
└────────────────────────────────────────┘

${e.message?`💬 KLANT BERICHT:
┌────────────────────────────────────────┐
│ ${e.message.split(`
`).join(`
│ `)}
└────────────────────────────────────────┘`:""}

🔧 SYSTEEM INFORMATIE:
┌────────────────────────────────────────┐
│ 🔗 Bron: TableTech Website
│ ⏰ Geboekt op: ${new Date().toLocaleString("nl-NL")}
│ 🌐 IP Tracking: Enabled
│ 🔐 Anti-dubbelboeking: Actief
└────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ACTIE VEREIST: Bevestig deze afspraak binnen 24 uur
📞 Contacteer klant: ${e.phone} of ${e.email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `,o=new FormData;o.append("_to","info@tabletech.nl"),o.append("_subject",`🔥 NIEUWE AFSPRAAK - ${e.name} (${e.date})`),o.append("_template","table"),o.append("_captcha","false"),o.append("booking_id",i),o.append("naam",e.name),o.append("email",e.email),o.append("telefoon",e.phone),o.append("restaurant",e.restaurant||"Niet opgegeven"),o.append("datum",e.date),o.append("tijd",e.time),o.append("bericht",e.message||"Geen specifiek bericht"),o.append("volledig_bericht",t);const s=await fetch("https://formsubmit.co/info@tabletech.nl",{method:"POST",body:o,headers:{Accept:"application/json"}});if(s.ok)n=!0;else throw new Error(`Business email failed: ${s.status}`);const c=`
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
  
        <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin: 0 0 20px;">Beste ${e.name},</p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
          We hebben je aanvraag voor een afspraak in goede orde ontvangen! 
          We nemen binnen 1 werkdag contact met je op om de afspraak te bevestigen.
        </p>
        
        <!-- Appointment Highlight -->
        <div style="background-color: #FFF5F0; border-radius: 8px; margin: 24px 0; padding: 20px; border: 2px solid #E86C28; text-align: left;">
          <p style="color: #1a1a1a; font-size: 18px; line-height: 24px; margin: 0 0 8px; font-weight: 600;">
            📅 <strong>Jouw voorkeur:</strong> ${e.date} om ${e.time}
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
            <strong>Naam:</strong> ${e.name}
          </p>
          <p style="color: #2d3748; font-size: 14px; line-height: 22px; margin: 0 0 12px; text-align: left;">
            <strong>E-mail:</strong> ${e.email}
          </p>
          <p style="color: #2d3748; font-size: 14px; line-height: 22px; margin: 0 0 12px; text-align: left;">
            <strong>Telefoon:</strong> ${e.phone}
          </p>
          ${e.restaurant?`<p style="color: #2d3748; font-size: 14px; line-height: 22px; margin: 0 0 12px; text-align: left;">
            <strong>Restaurant:</strong> ${e.restaurant}
          </p>`:""}
          <p style="color: #2d3748; font-size: 14px; line-height: 22px; margin: 0 0 12px; text-align: left;">
            <strong>Bericht:</strong>
          </p>
          <div style="background-color: #ffffff; border: 1px solid #E86C28; border-radius: 6px; color: #4a5568; font-size: 14px; line-height: 22px; margin: 12px 0 16px; padding: 16px; white-space: pre-wrap; text-align: left;">
            ${e.message||"Geen specifiek bericht"}
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
      `,r=new FormData;r.append("_to",e.email),r.append("_subject",`✅ Bevestiging: Je TableTech afspraak op ${e.date}`),r.append("_template","table"),r.append("_captcha","false"),r.append("_replyto","info@tabletech.nl"),r.append("_format","html"),r.append("_cc","info@tabletech.nl"),r.append("klant_naam",e.name),r.append("afspraak_datum",e.date),r.append("afspraak_tijd",e.time),r.append("message",c),(await fetch("https://formsubmit.co/ajax/"+e.email,{method:"POST",body:r,headers:{Accept:"application/json"}})).ok}catch{}if(!n)try{const t=await fetch("https://formspree.io/f/xpwzgzrd",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:e.email,naam:e.name,telefoon:e.phone,restaurant:e.restaurant||"Niet opgegeven",datum:e.date,tijd:e.time,bericht:e.message||"Geen specifiek bericht",_subject:`🔥 NIEUWE AFSPRAAK - ${e.name} (${e.date})`,_replyto:e.email})});if(t.ok)n=!0;else throw new Error(`Formspree failed: ${t.status}`)}catch{}if(!n)try{const t=new FormData;t.append("form-name","tabletech-appointments"),t.append("naam",e.name),t.append("email",e.email),t.append("telefoon",e.phone),t.append("restaurant",e.restaurant||"Niet opgegeven"),t.append("datum",e.date),t.append("tijd",e.time),t.append("bericht",e.message||"Geen specifiek bericht");const o=await fetch("/",{method:"POST",body:t});if(o.ok)n=!0;else throw new Error(`Netlify Forms failed: ${o.status}`)}catch{}if(!n){const t={timestamp:new Date().toISOString(),status:"MANUAL_FOLLOW_UP_REQUIRED",appointmentData:e,priority:"HIGH",action_required:"Contact customer directly within 24 hours"};try{const o=JSON.parse(localStorage.getItem("tabletech-failed-emails")||"[]");o.push(t),localStorage.setItem("tabletech-failed-emails",JSON.stringify(o))}catch{}}return n}catch(i){if(i instanceof Error&&i.message.includes("al gereserveerd"))throw i;return!1}};export{p as sendAppointmentEmail};
