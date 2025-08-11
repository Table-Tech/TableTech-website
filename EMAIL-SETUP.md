# Email Setup voor Afspraken - TableTech Website

## Huidige Implementatie

De afspraak booking functionaliteit is geïmplementeerd met email ondersteuning naar `info@tabletech.nl`. 

### Development Mode
- Appointments worden gelogd in browser console
- Data wordt opgeslagen in localStorage voor testing
- Simuleert succesvolle email verzending

### Production Mode  
- Probeert FormSubmit.co service te gebruiken
- Falls back naar mailto link bij falen
- Alle appointment data wordt netjes geformatteerd

## Email wordt verzonden naar: `info@tabletech.nl`

### Appointment Email bevat:
- 📅 **Datum & Tijd**: Geselecteerde afspraak datum en tijd
- 👤 **Klant Info**: Naam, email, telefoon, restaurant (optioneel)
- 💬 **Bericht**: Eventueel bericht van de klant
- ✅ **Type**: Gratis Adviesgesprek (30 minuten)

## Productie Implementatie Opties

### Option 1: EmailJS (Aanbevolen voor simpele setup)
```bash
npm install emailjs-com
```

1. Account aanmaken op [EmailJS](https://www.emailjs.com/)
2. Email service configureren (Gmail, Outlook, etc.)
3. Template maken voor appointment emails
4. Service ID, Template ID en User ID configureren

### Option 2: Backend API + Email Service
1. Node.js/Express backend maken
2. Email service zoals Nodemailer, SendGrid, of Mailgun gebruiken
3. API endpoint `/api/send-appointment-email` implementeren

### Option 3: FormSubmit.co (Huidige fallback)
- Gratis service voor forms naar email
- Geen setup vereist
- Beperkte customization

## Configuratie Stappen voor ProductieFormSubmit.co

### Huidig (FormSubmit.co - Werkend)
1. ✅ Geen setup vereist - direct werkend
2. ✅ Emails gaan naar `info@tabletech.nl`
3. ✅ Netjes geformatteerde berichten
4. ⚠️ Beperkte aanpassing opties

### Voor EmailJS (Aanbevolen upgrade):
1. Account maken op EmailJS.com
2. Email service connecten (Gmail/Outlook)
3. Template maken met variabelen
4. Configuratie toevoegen aan `src/services/emailService.ts`

### Voor eigen backend:
1. Backend API server opzetten
2. Email service configureren
3. Endpoint maken: `POST /api/send-appointment-email`
4. CORS headers configureren

## Testing

### Development:
- Open browser dev tools console
- Vul booking form in
- Check console voor email data
- Check localStorage voor opgeslagen appointments

### Production:
- Test booking form op live website
- Controleer of emails aankomen op info@tabletech.nl
- Verificeer fallback naar mailto bij problemen

## Email Template Voorbeeld

```
Onderwerp: Nieuwe afspraak: [Naam] - [Datum] [Tijd]

Nieuwe Afspraak Details:
━━━━━━━━━━━━━━━━━━━━
📅 Datum: maandag 12 februari 2024
🕐 Tijd: 14:30
👤 Naam: Jan Jansen
📧 Email: jan@restaurant.nl
📱 Telefoon: +31 6 12345678
🏪 Restaurant: Café de Vriendschap

💬 Bericht:
Ik wil graag meer weten over de analytics functionaliteiten...

Automatisch verzonden via TableTech website.
```

## Troubleshooting

- **Emails komen niet aan**: Check spam folder
- **FormSubmit werkt niet**: Fallback naar mailto link wordt aangeboden
- **Development mode**: Emails worden niet echt verzonden, alleen gelogd

## Support

Voor vragen over email setup: neem contact op via de development team of check de implementatie in `src/services/emailService.ts`.