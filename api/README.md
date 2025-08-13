# TableTech Appointment API

Production-ready appointment booking API with advanced security and email capabilities.

## Features

- 🔒 **Advanced Security**: Rate limiting, CAPTCHA, honeypot, spam detection
- 📧 **Professional Emails**: HTML templates with React Email, plaintext fallback
- 🔄 **Idempotency**: Prevents duplicate submissions
- 📊 **Observability**: Structured logging with Pino
- ✅ **Validation**: Zod schemas with TypeScript
- 🚀 **Production Ready**: Deployable to Vercel/Netlify

## Quick Start

### Installation

```bash
# Install backend dependencies
cd api
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Frontend Integration

The frontend is already integrated in the main TableTech website. The API proxy is configured in `vite.config.ts`.

```bash
# In the root directory
npm install
npm run dev
```

## API Documentation

### Endpoint

`POST /api/appointments`

### Request Headers

```
Content-Type: application/json
Idempotency-Key: <UUID v4>
X-Client-Version: 1.0.0
```

### Request Body

```json
{
  "firstName": "Jan",
  "lastName": "de Vries",
  "email": "jan@restaurant.nl",
  "phone": "+31612345678",
  "restaurant": "Restaurant De Gouden Lepel",
  "preferredDate": "2024-12-25",
  "preferredTime": "14:30",
  "subject": "Demo aanvraag",
  "message": "Ik wil graag meer weten over jullie systeem",
  "consentMarketing": true,
  "hp": "",
  "formRenderTs": 1703500000000,
  "captchaToken": "turnstile-token-here"
}
```

### Response

Success (200):
```json
{
  "ok": true,
  "requestId": "abc123xyz"
}
```

Error (4xx/5xx):
```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": [...]
  }
}
```

### Error Codes

- `INVALID_HEADERS`: Missing or invalid request headers
- `VALIDATION_ERROR`: Invalid form data
- `SPAM_DETECTED`: Submission flagged as spam
- `CAPTCHA_FAILED`: CAPTCHA verification failed
- `INVALID_EMAIL`: Disposable or role-based email
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `EMAIL_FAILED`: Email sending failed
- `INTERNAL_ERROR`: Server error

## Security Features

### 1. Rate Limiting
- 5 requests per 10 minutes per IP (configurable)
- IP addresses are hashed for privacy

### 2. CAPTCHA Support
- Cloudflare Turnstile (default)
- hCaptcha
- reCAPTCHA v3

### 3. Anti-Spam Measures
- Honeypot field detection
- Minimum form fill time (1.2 seconds)
- URL count limits in messages
- Spam keyword detection
- Disposable email blocking

### 4. Idempotency
- Prevents duplicate submissions
- 5-minute cache window
- UUID v4 idempotency keys

## Environment Variables

```env
# Node
NODE_ENV=production
PORT=3001

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
MAIL_FROM="TableTech <noreply@tabletech.nl>"
MAIL_TO_INTERNAL=info@tabletech.nl

# Brand
BRAND_NAME=TableTech
BRAND_COLOR=#E86C28
SUPPORT_EMAIL=info@tabletech.nl
WEBSITE_URL=https://tabletech.nl

# Security
ENABLE_CAPTCHA=true
CAPTCHA_PROVIDER=turnstile
CAPTCHA_SECRET=your_secret_here

# Rate Limiting
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=600000

# Anti-Spam
MIN_FORM_FILL_TIME=1200
MAX_URLS_IN_MESSAGE=3
```

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`
3. Set environment variables in Vercel dashboard

### Netlify Functions

1. Create `netlify.toml`:
```toml
[build]
  command = "cd api && npm install && npm run build"
  functions = "api/dist"

[functions]
  node_bundler = "esbuild"
```

2. Deploy with Netlify CLI or Git

## Email Deliverability

### SPF Record
```
v=spf1 include:spf.resend.com ~all
```

### DKIM
Add DKIM records provided by Resend in your DNS settings.

### DMARC
```
v=DMARC1; p=none; rua=mailto:dmarc@tabletech.nl; pct=100
```

## Production Deployment

The API is production-ready and can be deployed to:
- Vercel (recommended)
- Netlify Functions
- Any Node.js hosting platform

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure your Resend API key
3. Set up Cloudflare Turnstile
4. Configure domain verification

## Monitoring

- Logs are structured JSON (Pino)
- Request IDs for tracing
- IP hashing for privacy
- Duration tracking
- Error rates

## Support

For issues or questions:
- Email: info@tabletech.nl
- Documentation: https://tabletech.nl/docs