# 🔧 FIX: Resend Emails Worden Niet Verstuurd

## Probleem
Emails worden niet verstuurd ondanks dat RESEND_API_KEY in Vercel staat.

## Stap 1: Test Email Configuratie

### Test endpoint (na deployment):
```
https://table-tech-website.vercel.app/api/test-email
```

Dit toont of RESEND_API_KEY correct is geconfigureerd.

### Test email versturen:
```bash
curl -X POST https://table-tech-website.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"info@tabletech.nl"}'
```

## Stap 2: Vercel Environment Variables

### Ga naar Vercel Dashboard:
1. Open https://vercel.com/dashboard
2. Klik op **table-tech-website**
3. Ga naar **Settings** → **Environment Variables**

### Voeg deze variables toe:

| Variable | Value | Environments |
|----------|-------|--------------|
| `RESEND_API_KEY` | `re_KxSUc845_8PT8WHE6ZK7py7hCCTRsLZDR` | ✅ All |
| `MAIL_FROM` | `TableTech <info@tabletech.nl>` | ✅ All |
| `FROM_EMAIL` | `info@tabletech.nl` | ✅ All |
| `MAIL_TO_INTERNAL` | `info@tabletech.nl` | ✅ All |

**BELANGRIJK**:
- Geen quotes om de values!
- Geen spaties voor/na!
- Alle environments aanvinken!

## Stap 3: Check Resend Dashboard

### Verifieer domein:
1. Ga naar https://resend.com/domains
2. Check of `tabletech.nl` is **Verified** ✅
3. Als niet verified:
   - Klik op domein
   - Volg DNS instructies
   - Wacht op verificatie

### Check API Key:
1. Ga naar https://resend.com/api-keys
2. Verifieer dat de key actief is
3. Check permissions (moet "Send emails" hebben)

## Stap 4: Vercel Function Logs

### Check logs voor errors:
1. In Vercel Dashboard
2. Ga naar **Functions** tab
3. Klik op `api/appointments/create`
4. Check **Logs** voor errors zoals:
   - "No RESEND_API_KEY found"
   - "Resend API error"
   - "401 Unauthorized"

## Stap 5: Veelvoorkomende Problemen

### Problem 1: API Key niet gevonden
**Symptoom**: "No RESEND_API_KEY found" in logs
**Fix**:
- Environment variable is niet correct ingesteld
- Redeploy na toevoegen variables

### Problem 2: 401 Unauthorized
**Symptoom**: "401" error van Resend
**Fix**:
- API key is verkeerd of verlopen
- Genereer nieuwe key in Resend dashboard

### Problem 3: Domain not verified
**Symptoom**: "Domain not verified" error
**Fix**:
- Verifieer domein in Resend dashboard
- Wacht tot DNS records zijn gepropageerd (kan 24 uur duren)

### Problem 4: From address invalid
**Symptoom**: "Invalid from address"
**Fix**:
- From email moet van verified domain zijn
- Gebruik `info@tabletech.nl` (niet gmail etc.)

## Stap 6: Test Workflow

Na alle fixes:

1. **Test API endpoint**:
   ```
   GET https://table-tech-website.vercel.app/api/test-email
   ```
   Moet tonen: `RESEND_API_KEY: ✅ SET`

2. **Verstuur test email**:
   ```
   POST https://table-tech-website.vercel.app/api/test-email
   Body: {"email": "jouw@email.com"}
   ```

3. **Maak test afspraak**:
   - Ga naar website
   - Vul formulier in
   - Check Vercel logs
   - Check inbox

## Debug Checklist

- [ ] RESEND_API_KEY in Vercel Environment Variables
- [ ] MAIL_FROM ook toegevoegd
- [ ] Alle 3 environments aangevinkt
- [ ] Redeployed na toevoegen variables
- [ ] Domein verified in Resend (tabletech.nl)
- [ ] API key is actief in Resend
- [ ] Test endpoint werkt (/api/test-email)
- [ ] Logs tonen "Email sent successfully"
- [ ] Emails komen aan

## Extra Debug Info

### In Vercel Function logs moet je zien:
```
📧 Attempting to send email to: info@tabletech.nl
   Subject: Afspraak bevestiging - 2025-09-18
   API Key found: re_KxSUc84...
   From address: info@tabletech.nl
   Sending to Resend API...
   ✅ Email sent successfully: 123e4567-e89b-12d3-a456-426614174000
```

### Als je dit NIET ziet:
- Environment variables zijn niet correct
- Redeploy zonder cache nodig

---

**Na deze stappen zouden emails moeten werken!**