# Environment Variables Fix

## Issue
Environment variables from `dev.env` were not being loaded because Vite only automatically loads specific file names.

## Root Cause
Vite automatically loads these files in order:
- `.env`
- `.env.local` 
- `.env.development`
- `.env.production`

Custom named files like `dev.env` are **not** automatically loaded.

## Solution Applied ✅

1. **Created `.env.local`** from `dev.env`:
   ```bash
   cp dev.env .env.local
   ```

2. **Verified `.env.local` is in `.gitignore`** ✅

3. **Updated documentation** to reflect proper usage

## For Development

Use `.env.local` for local development:
```bash
# This file is automatically loaded by Vite
.env.local
```

## For Production Deployment

Use the values from `prod.env` in your hosting platform's environment variables section (Netlify/Vercel).

## Verification

After copying `dev.env` to `.env.local`, restart your development server:
```bash
npm run dev
```

The Google Places API and EmailJS should now work correctly with the environment variables being properly loaded.

## Environment Files Structure

```
├── dev.env              # Template for development (Git ignored)
├── prod.env             # Template for production (Git ignored)  
├── .env.local           # Active development config (Git ignored)
└── .env.example         # Public template (optional)
```

**Note**: Only `.env.local` is automatically loaded by Vite during development. 