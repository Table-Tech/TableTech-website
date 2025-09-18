# Vercel 401 Error Fix - Complete Oplossing

## 🔴 HET PROBLEEM

Je krijgt een **401 Unauthorized error** op `site.webmanifest` en andere statische bestanden omdat:

### Oorzaak: Vercel Deployment Protection
Vercel heeft **automatisch "Deployment Protection"** ingeschakeld op je preview deployments. Dit betekent:
- ALLE bestanden (inclusief manifest, icons, CSS, JS) vereisen authenticatie
- Browsers kunnen geen authenticatie credentials sturen voor manifest files
- Dit resulteert in 401 errors

## ✅ DE OPLOSSING (Direct Werkend)

### Stap 1: Open Vercel Dashboard
1. Ga naar: https://vercel.com/dashboard
2. Klik op je project: **table-tech-website**

### Stap 2: Ga naar Settings
1. Klik op de **"Settings"** tab bovenaan
2. Blijf in de **"General"** sectie (standaard geopend)

### Stap 3: Vind Deployment Protection
1. Scroll naar beneden tot je **"Deployment Protection"** ziet
2. Je ziet waarschijnlijk:
   - ✅ **Standard Protection** is ENABLED
   - Dit blokkeert alle niet-geauthenticeerde toegang

### Stap 4: Schakel Protection Uit
Je hebt 3 opties:

#### Optie A: Volledig Uitschakelen (Snelste Fix)
1. Zet **"Standard Protection"** op **OFF/DISABLED**
2. Dit maakt preview deployments publiek toegankelijk
3. Klik **"Save"**

#### Optie B: Alleen Preview Uitschakelen (Veiliger)
1. Houd Production Protection aan
2. Schakel alleen Preview Protection uit
3. Klik **"Save"**

#### Optie C: Exceptions Toevoegen (Meest Veilig)
1. Houd Protection aan
2. Ga naar **"Protection Bypass for Automation"**
3. Voeg je domeinen toe als exception:
   - `table-tech-website-*.vercel.app`
4. Klik **"Save"**

## 🎯 DIRECT RESULTAAT

Na het uitschakelen van Deployment Protection:
- ✅ Geen 401 errors meer op `site.webmanifest`
- ✅ Alle statische bestanden laden correct
- ✅ PWA features werken weer
- ✅ Icons en favicons laden

## ⚠️ BELANGRIJKE INFORMATIE

### Waarom Gebeurt Dit?
- Vercel schakelt **automatisch** protection in op nieuwe projecten
- Dit is voor beveiliging van preview deployments
- Veel developers hebben dit probleem met PWAs

### Is Het Veilig Om Uit Te Schakelen?
- **JA** voor preview deployments:
  - Vercel voegt automatisch `x-robots-tag: noindex` toe
  - Google indexeert preview deployments NIET
  - Preview URLs zijn complex en moeilijk te raden

### Alternatieve Oplossingen (Als Je Protection Wilt Houden)

#### 1. Gebruik een CDN voor statische assets:
```javascript
// Host manifest op externe CDN
<link rel="manifest" href="https://cdn.jsdelivr.net/gh/yourusername/repo/site.webmanifest">
```

#### 2. Inline de manifest data:
```html
<link rel="manifest" href='data:application/manifest+json,{
  "name":"TableTech",
  "short_name":"TableTech",
  "theme_color":"#00d4ff"
}'>
```

#### 3. Gebruik Service Worker fallback:
```javascript
// In service worker
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('site.webmanifest')) {
    event.respondWith(
      new Response(JSON.stringify(manifestData), {
        headers: { 'Content-Type': 'application/manifest+json' }
      })
    );
  }
});
```

## 📊 STATUS CHECK

Test of het werkt:
1. Open: https://table-tech-website.vercel.app/favicon/site.webmanifest
2. Je moet de JSON content zien (geen 401 error)

## 🔗 Bronnen

- [Vercel Deployment Protection Docs](https://vercel.com/docs/security/deployment-protection)
- [Vercel Community Discussion](https://github.com/vercel/vercel/discussions/5545)
- [PWA on Vercel Guide](https://vercel.com/guides/progressive-web-apps)

## 💡 Pro Tip

Voor productie websites:
1. Houd Production Protection AAN
2. Schakel Preview Protection UIT
3. Gebruik environment-specifieke URLs in je code

---

**Laatste Update:** September 2024
**Status:** Dit is een bekend Vercel probleem - ze werken aan een betere oplossing