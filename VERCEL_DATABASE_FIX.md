# Vercel Database Fix Guide

## Probleem Analyse
De Vercel deployment heeft 2 kritieke problemen:
1. **Authentication Failed**: "password authentication failed for user 'neondb_owner'"
2. **Missing Table**: "relation 'availability_config' does not exist"

## Stap 1: Database Setup op Neon

### 1.1 Login op Neon Dashboard
1. Ga naar https://console.neon.tech
2. Open je TableTech project

### 1.2 Voer Database Setup uit
1. Open de SQL editor in Neon
2. Copy & paste de inhoud van `database-setup.sql`
3. Run de query om alle tabellen aan te maken

### 1.3 Verifieer Tabellen
Run deze query om te checken:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

Je moet deze tabellen zien:
- appointments
- availability_config
- blocked_dates
- appointment_overview (view)

## Stap 2: Neon Database Credentials

### 2.1 Verkrijg Connection String
1. In Neon Dashboard, ga naar "Connection Details"
2. Selecteer "Pooled connection" (belangrijk voor serverless!)
3. Copy de connection string, het ziet er zo uit:
   ```
   postgresql://neondb_owner:YOUR_PASSWORD@ep-XXX.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2.2 Direct URL (voor migrations)
1. Selecteer "Direct connection"
2. Copy deze ook, ziet er zo uit:
   ```
   postgresql://neondb_owner:YOUR_PASSWORD@ep-XXX.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require
   ```

## Stap 3: Vercel Environment Variables

### 3.1 Open Vercel Dashboard
1. Ga naar https://vercel.com/dashboard
2. Open je TableTech project
3. Ga naar Settings → Environment Variables

### 3.2 Voeg Database Variables toe
Voeg deze environment variables toe:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | [Pooled connection string] | Production, Preview, Development |
| `DATABASE_URL_new` | [Pooled connection string] | Production, Preview, Development |
| `DIRECT_DATABASE_URL` | [Direct connection string] | Production, Preview, Development |

⚠️ **BELANGRIJK**:
- Gebruik de POOLED connection voor `DATABASE_URL` en `DATABASE_URL_new`
- Gebruik de DIRECT connection alleen voor `DIRECT_DATABASE_URL`
- Zorg dat ALLE environments zijn aangevinkt

### 3.3 Optioneel: Prisma Variables (indien gebruikt)
Als je Prisma gebruikt, voeg ook toe:
- `DATABASE_URL_UNPOOLED` = [Direct connection string]

## Stap 4: Test Lokaal

### 4.1 Update .env.local
```bash
# Database URLs voor Neon
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-XXX.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_new="postgresql://neondb_owner:YOUR_PASSWORD@ep-XXX.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-XXX.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require"
```

### 4.2 Test Database Connection
```bash
node api/test-db.js
```

Dit zou moeten outputten:
- ✅ Database connected successfully
- ✅ Found X availability configs
- ✅ Database test completed

## Stap 5: Deploy naar Vercel

### 5.1 Commit en Push
```bash
git add .
git commit -m "Fix database configuration for Vercel"
git push
```

### 5.2 Trigger Redeployment
Als auto-deploy niet werkt:
1. Ga naar Vercel Dashboard
2. Klik op "Redeploy"
3. Selecteer "Redeploy with existing Build Cache" UIT
4. Deploy

## Stap 6: Verifieer Deployment

### 6.1 Check Function Logs
1. In Vercel Dashboard, ga naar "Functions" tab
2. Klik op `api/appointments/availability`
3. Check de logs voor:
   - ✅ Database connected
   - ✅ Returning X slots

### 6.2 Test API Endpoint
Open in browser:
```
https://table-tech-website.vercel.app/api/appointments/availability
```

Je moet JSON response zien met slots.

## Troubleshooting

### Probleem: "password authentication failed"
- Check of je de juiste password gebruikt (geen special chars die escaping nodig hebben)
- Verifieer dat de connection string correct is gekopieerd
- Check of SSL mode is ingesteld op 'require'

### Probleem: "relation does not exist"
- Run database-setup.sql opnieuw in Neon
- Check of je connected bent met de juiste database (neondb)
- Verifieer schema is 'public'

### Probleem: "ECONNREFUSED"
- Gebruik POOLED connection, niet DIRECT voor serverless
- Check of database wakker is (Neon slaapt na inactiviteit)

### Probleem: Environment variables niet zichtbaar
1. Na toevoegen env vars in Vercel, MOET je redeployen
2. Clear build cache bij redeploy
3. Check in Function logs of vars bestaan

## Contact Support
Als problemen aanhouden:
- Neon Support: support@neon.tech
- Vercel Support: Via dashboard chat

## Checklist
- [ ] Database tabellen aangemaakt in Neon
- [ ] Connection strings gekopieerd (pooled + direct)
- [ ] Environment variables toegevoegd in Vercel
- [ ] Lokaal getest met test-db.js
- [ ] Deployed naar Vercel
- [ ] API endpoint werkt in productie