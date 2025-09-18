# Database Setup Guide - TableTech

## 🚨 PROBLEEM OPGELOST
De error `relation "availability_config" does not exist` betekent dat de database tabellen nog niet aangemaakt zijn.

## ✅ Snelle Fix - Stap voor stap

### Stap 1: Deploy de nieuwe code
```bash
git add .
git commit -m "Add database setup endpoint"
git push
```

### Stap 2: Wacht tot Vercel klaar is met deployen
Check je Vercel dashboard dat de deployment succesvol is.

### Stap 3: Maak de database tabellen aan
Open je browser of gebruik curl/Postman om deze request te sturen:

**URL:** `https://jouw-vercel-url.vercel.app/api/setup-database`

**Method:** POST

**Body (JSON):**
```json
{
  "setupKey": "tabletech-setup-2024",
  "dropExisting": false
}
```

**Voorbeeld met curl:**
```bash
curl -X POST https://jouw-vercel-url.vercel.app/api/setup-database \
  -H "Content-Type: application/json" \
  -d '{"setupKey": "tabletech-setup-2024"}'
```

### Stap 4: Check de response
Je krijgt een response zoals:
```json
{
  "success": true,
  "message": "Database setup completed successfully!",
  "tables": ["appointments", "availability_config", "blocked_dates"]
}
```

### Stap 5: Test de appointment API
Nu zou alles moeten werken! Test:
- `https://jouw-vercel-url.vercel.app/api/appointments/availability`

## 📊 Wat doet het setup script?

Het script maakt 3 tabellen aan:

1. **appointments** - Alle afspraken
2. **availability_config** - Wanneer je beschikbaar bent
3. **blocked_dates** - Vakanties/feestdagen

## 🔧 Alternatieve Methode - Direct in Neon

Als je liever direct in Neon werkt:

1. Ga naar https://console.neon.tech
2. Open je database
3. Ga naar SQL Editor
4. Plak de inhoud van `database-setup.sql`
5. Klik op Run

## ⚙️ Standaard Instellingen

Na setup heb je:
- **Beschikbaarheid:** Maandag t/m Vrijdag, 9:00 - 17:00
- **Tijdslot duur:** 30 minuten
- **Weekend:** Geen afspraken mogelijk

## 🛡️ Beveiliging

De setup endpoint is beveiligd met een key: `tabletech-setup-2024`
Verander deze in productie!

## 🆘 Troubleshooting

### "Database configuration missing"
→ Check dat DATABASE_URL_new in Vercel environment variables staat

### "permission denied"
→ Je database user heeft geen CREATE rechten

### "table already exists"
→ Gebruik `"dropExisting": true` om bestaande tabellen eerst te verwijderen

## 📝 Volgende Stappen

1. ✅ Database tabellen aanmaken (via API endpoint)
2. ✅ Test appointment system
3. 🔜 Pas beschikbaarheid aan indien nodig
4. 🔜 Voeg geblokkeerde datums toe voor feestdagen

## Support

Voor hulp, check:
- Vercel Function Logs
- Neon Dashboard → Tables sectie
- Browser Console voor API responses