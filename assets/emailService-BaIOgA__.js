const p=async e=>{try{const i=`TT-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,s=`${e.date}-${e.time}`,n=JSON.parse(localStorage.getItem("tabletech-booked-slots")||"{}");if(n[s])throw new Error("Deze tijd is al gereserveerd. Kies een andere tijd.");n[s]={bookingId:i,customerName:e.name,customerEmail:e.email,bookedAt:new Date().toISOString()},localStorage.setItem("tabletech-booked-slots",JSON.stringify(n));const d={to:"info@tabletech.nl",subject:`🔥 NIEUWE AFSPRAAK - ${e.name} (${e.date} ${e.time})`,bookingId:i,appointmentData:e};try{const r=JSON.parse(localStorage.getItem("tabletech-appointments")||"[]");r.push({...d,timestamp:new Date().toISOString(),id:Date.now()}),localStorage.setItem("tabletech-appointments",JSON.stringify(r))}catch{}let l=!1;try{const r=`
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
      `,t=new FormData;t.append("_to","info@tabletech.nl"),t.append("_subject",`🔥 NIEUWE AFSPRAAK - ${e.name} (${e.date})`),t.append("_template","table"),t.append("_captcha","false"),t.append("booking_id",i),t.append("naam",e.name),t.append("email",e.email),t.append("telefoon",e.phone),t.append("restaurant",e.restaurant||"Niet opgegeven"),t.append("datum",e.date),t.append("tijd",e.time),t.append("bericht",e.message||"Geen specifiek bericht"),t.append("volledig_bericht",r);const a=await fetch("https://formsubmit.co/info@tabletech.nl",{method:"POST",body:t,headers:{Accept:"application/json"}});if(a.ok)l=!0;else throw new Error(`Business email failed: ${a.status}`);const c=`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <!-- Volledig oranje header bar -->
  <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); height: 8px; width: 100%;"></div>
  
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <img src="https://tabletech.nl/logo4.png" alt="TableTech Logo" style="height: 60px; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Afspraak Bevestiging</h1>
  </div>
  
  <div style="padding: 30px;">
    <h2 style="color: #333; margin-bottom: 20px;">Beste ${e.name},</h2>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="color: #667eea; margin: 0 0 15px 0;">🎉 Bedankt voor je afspraak bij TableTech!</h3>
      <p style="margin: 5px 0; color: #555;"><strong>📅 Datum:</strong> ${e.date}</p>
      <p style="margin: 5px 0; color: #555;"><strong>🕐 Tijd:</strong> ${e.time}</p>
      <p style="margin: 5px 0; color: #555;"><strong>⏱️ Duur:</strong> 30 minuten</p>
      <p style="margin: 5px 0; color: #555;"><strong>🎯 Type:</strong> Gratis Adviesgesprek</p>
      <p style="margin: 5px 0; color: #555;"><strong>🆔 Referentie:</strong> ${i}</p>
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
      `,o=new FormData;o.append("_to",e.email),o.append("_subject",`✅ Bevestiging: Je TableTech afspraak op ${e.date}`),o.append("_template","table"),o.append("_captcha","false"),o.append("_replyto","info@tabletech.nl"),o.append("klant_naam",e.name),o.append("afspraak_datum",e.date),o.append("afspraak_tijd",e.time),o.append("bevestiging_bericht",c),o.append("_format","html"),(await fetch("https://formsubmit.co/ajax/"+e.email,{method:"POST",body:o,headers:{Accept:"application/json"}})).ok}catch{}if(!l)try{const r=await fetch("https://formspree.io/f/xpwzgzrd",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:e.email,naam:e.name,telefoon:e.phone,restaurant:e.restaurant||"Niet opgegeven",datum:e.date,tijd:e.time,bericht:e.message||"Geen specifiek bericht",_subject:`🔥 NIEUWE AFSPRAAK - ${e.name} (${e.date})`,_replyto:e.email})});if(r.ok)l=!0;else throw new Error(`Formspree failed: ${r.status}`)}catch{}if(!l)try{const r=new FormData;r.append("form-name","tabletech-appointments"),r.append("naam",e.name),r.append("email",e.email),r.append("telefoon",e.phone),r.append("restaurant",e.restaurant||"Niet opgegeven"),r.append("datum",e.date),r.append("tijd",e.time),r.append("bericht",e.message||"Geen specifiek bericht");const t=await fetch("/",{method:"POST",body:r});if(t.ok)l=!0;else throw new Error(`Netlify Forms failed: ${t.status}`)}catch{}if(!l){const r={timestamp:new Date().toISOString(),status:"MANUAL_FOLLOW_UP_REQUIRED",appointmentData:e,priority:"HIGH",action_required:"Contact customer directly within 24 hours"};try{const t=JSON.parse(localStorage.getItem("tabletech-failed-emails")||"[]");t.push(r),localStorage.setItem("tabletech-failed-emails",JSON.stringify(t))}catch{}}return l}catch(i){if(i instanceof Error&&i.message.includes("al gereserveerd"))throw i;return!1}};export{p as sendAppointmentEmail};
