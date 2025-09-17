# Vercel Deployment Fix Guide

## Current Issues Fixed:
1. ✅ API returns 500 error - Missing DATABASE_URL environment variable
2. ✅ Manifest 401 error - Authentication issue with preview deployments
3. ✅ API endpoint configuration - Using relative paths

## Required Vercel Environment Variables

You MUST add these environment variables in Vercel Dashboard:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your `table-tech-website` project
- Go to "Settings" → "Environment Variables"

### 2. Add Database Configuration
```
DATABASE_URL = "postgresql://username:password@host:port/database?sslmode=require"
```
Get this from your database provider (Supabase/Neon/etc.)

### 3. Add Email Configuration (Resend)
```
RESEND_API_KEY = "re_xxxxxxxxxxxxxxxxxxxxx"
```
Get this from https://resend.com/api-keys

### 4. Optional: Add these for better debugging
```
NODE_ENV = "production"
```

## Vercel Configuration Files

### vercel.json (already configured)
- API functions timeout: 10 seconds
- CORS headers configured
- Routing configured

### .env.production (already configured)
- Uses relative paths for API calls
- No hardcoded URLs

## Testing Your Deployment

1. **Check Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Ensure DATABASE_URL and RESEND_API_KEY are set

2. **Redeploy After Adding Variables:**
   - After adding environment variables, you MUST redeploy
   - Go to Deployments → Click "..." → "Redeploy"

3. **Test API Endpoints:**
   ```
   https://your-domain.vercel.app/api/appointments/availability
   ```
   Should return JSON with appointment slots

## Common Issues and Solutions

### Issue: 500 Internal Server Error on API
**Solution:** DATABASE_URL not set in Vercel environment variables

### Issue: 401 Unauthorized on manifest/favicon
**Solution:** This is normal for preview deployments with authentication. Production deployment will work.

### Issue: CORS errors
**Solution:** Already handled in vercel.json and API functions

## Deployment Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# Check logs
vercel logs
```

## Database Setup

Make sure your PostgreSQL database has these tables:
- appointments
- availability_config
- blocked_dates

Run the setup script from `database-setup.sql` if needed.

## Support

For issues, check:
1. Vercel Function Logs: Dashboard → Functions → View Logs
2. Browser Console: Check for client-side errors
3. Network Tab: Check API responses

## Next Steps

1. Add DATABASE_URL to Vercel environment variables
2. Add RESEND_API_KEY to Vercel environment variables
3. Redeploy the project
4. Test the appointment system