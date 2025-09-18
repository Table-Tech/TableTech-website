# TableTech Vercel Deployment Guide

## 📋 Overzicht

Dit project is geconfigureerd voor deployment op Vercel met serverless functions voor de backend API.

## 🚀 Deployment Stappen

### 1. Vercel Project Setup
1. Ga naar [vercel.com](https://vercel.com)
2. Import je GitHub repository
3. Selecteer het project type: **Vite**

### 2. Environment Variables in Vercel
Voeg de volgende environment variables toe in je Vercel dashboard:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_XE2U8kfAILQR@ep-little-haze-agtrjreh.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
RESEND_API_KEY=re_KxSUc845_8PT8WHE6ZK7py7hCCTRsLZDR
COMPANY_EMAIL=info@tabletech.nl
NODE_ENV=production
```

### 3. Build Settings
Vercel detecteert automatisch de juiste build instellingen:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. API Endpoints
Na deployment zijn de volgende endpoints beschikbaar:
- `GET /api/appointments/availability` - Beschikbare tijdslots
- `GET /api/appointments/check-slot` - Check specifiek tijdslot
- `POST /api/appointments/create` - Maak nieuwe afspraak

## 🛠️ Lokale Development

### Met Vercel CLI (Aanbevolen)
```bash
# Installeer Vercel CLI
npm i -g vercel

# Login
vercel login

# Start development server
npm run dev:vercel
```

### Traditionele setup
```bash
# Frontend (poort 5173)
npm run dev

# Backend API (poort 3001) - aparte terminal
npm run dev:api
```

## 📁 Project Structuur

```
├── api/                    # Vercel Functions
│   └── appointments/
│       ├── availability.js  # GET beschikbaarheid
│       ├── check-slot.js   # GET slot check
│       └── create.js       # POST nieuwe afspraak
├── src/                    # Frontend Vite app
├── public/                 # Statische bestanden
├── vercel.json            # Vercel configuratie
└── package.json
```

## 🔧 Configuratie

### vercel.json
- **Functions**: Configuratie voor API endpoints
- **Rewrites**: URL routing
- **Headers**: CORS instellingen
- **Environment**: Environment variables mapping

### src/utils/api.ts
- Centralized API client
- Automatische error handling
- TypeScript type safety

## 🚨 Belangrijke Opmerkingen

1. **Database**: Moet extern gehost zijn (Neon, PlanetScale, etc.)
2. **Email**: Gebruikt Resend service voor emails
3. **CORS**: Automatisch geconfigureerd voor alle origins
4. **Caching**: 5 minuten cache voor availability endpoint
5. **Error Handling**: Uitgebreide error logging en user feedback

## 📊 Monitoring

Na deployment kun je het volgende monitoren:
- **Vercel Dashboard**: Function performance en logs
- **Database**: Connection pooling en query performance
- **Email Service**: Delivery rates via Resend dashboard

## 🔄 Updates Deployen

```bash
# Commit changes
git add .
git commit -m "Your update message"
git push origin main

# Vercel deployed automatisch vanuit main branch
```

## 🐛 Troubleshooting

### Function Timeout
- Vercel free tier heeft 10 seconden limiet
- Database queries optimaliseren
- Connection pooling gebruiken

### CORS Issues
- Controleer vercel.json headers
- Test met verschillende origins

### Database Connection
- Controleer DATABASE_URL
- SSL instellingen verificeren
- Connection limits controleren

## 📞 Support

Voor vragen of problemen, check:
1. Vercel function logs
2. Browser developer tools
3. Database logs
4. Email service logs