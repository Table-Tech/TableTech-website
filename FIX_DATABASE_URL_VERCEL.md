# 🚨 FIX DATABASE ERROR "getaddrinfo ENOTFOUND base"

## Het Probleem
Je DATABASE_URL in Vercel bevat **"base"** als hostname wat NIET bestaat.
Dit betekent dat er waarschijnlijk een placeholder of verkeerde URL is ingesteld.

## DE OPLOSSING - Stap voor Stap

### 1. Open Vercel Dashboard
- Ga naar: https://vercel.com/dashboard
- Klik op je project: **table-tech-website**

### 2. Ga naar Environment Variables
- Klik op **Settings** tab
- Klik op **Environment Variables** in het linker menu

### 3. Verwijder/Update VERKEERDE Variables
Zoek naar deze variables en VERWIJDER ze als ze "base" bevatten:
- ❌ `DATABASE_URL` = "base" of "postgresql://base..." → **DELETE**
- ❌ `BASE_URL` = als dit database info bevat → **DELETE**

### 4. Voeg de JUISTE Database URL toe

Klik **"Add New"** en vul in:

**Key:** `DATABASE_URL_new`
**Value:**
```
postgresql://neondb_owner:npg_XE2U8kfAILQR@ep-little-haze-agtrjreh-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Environment:** Vink ALLE 3 aan:
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. BELANGRIJK: Ook DATABASE_URL toevoegen

Klik weer **"Add New"** en vul in:

**Key:** `DATABASE_URL`
**Value:** (ZELFDE als hierboven)
```
postgresql://neondb_owner:npg_XE2U8kfAILQR@ep-little-haze-agtrjreh-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Environment:** Vink ALLE 3 aan:
- ✅ Production
- ✅ Preview
- ✅ Development

### 6. Save & Redeploy
1. Klik **"Save"** bij elke variable
2. Ga naar **"Deployments"** tab
3. Klik op de 3 puntjes (...) bij laatste deployment
4. Klik **"Redeploy"**
5. BELANGRIJK: Vink **"Use existing build cache"** UIT

## Verificatie

Na redeploy (2-3 minuten), test deze URLs:

1. **Debug endpoint:**
   ```
   https://table-tech-website.vercel.app/api/debug
   ```
   Je moet zien:
   - DATABASE_URL_new: SET ✅
   - DATABASE_URL: SET ✅

2. **Availability endpoint:**
   ```
   https://table-tech-website.vercel.app/api/appointments/availability
   ```
   Je moet JSON data zien ZONDER errors

## Waarom "base" Error?

Dit gebeurt vaak als:
1. Je hebt `BASE_URL` per ongeluk als `DATABASE_URL` ingesteld
2. Een placeholder value "base" is niet vervangen
3. Copy-paste error bij environment variables

## Checklist

- [ ] Vercel Dashboard geopend
- [ ] Environment Variables sectie gevonden
- [ ] Alle variables met "base" VERWIJDERD
- [ ] DATABASE_URL_new toegevoegd met Neon URL
- [ ] DATABASE_URL ook toegevoegd (backup)
- [ ] Alle 3 environments aangevinkt
- [ ] Redeployed zonder cache
- [ ] /api/debug getest - toont variables correct
- [ ] /api/appointments/availability werkt

## Nog Steeds Problemen?

Check in Neon Dashboard (https://console.neon.tech):
1. Is je database actief? (niet suspended)
2. Copy de **POOLED** connection string (niet Direct)
3. Zorg dat het eindigt op `?sslmode=require`

---

**Dit lost het "ENOTFOUND base" probleem DIRECT op!**