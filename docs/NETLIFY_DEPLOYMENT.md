# Netlify Deployment Guide

## 🚨 Current Error Fix

### Problem
```
sh: 1: vite: not found
Command failed with exit code 127: npm run build
base: /opt/build/repo/public  # ← WRONG BASE DIRECTORY
```

### Root Causes
1. **Wrong base directory**: Set to `public` instead of root
2. **Missing dependencies**: Vite not installed properly
3. **Incorrect build configuration**

## ✅ Solution Steps

### Step 1: Update Netlify Site Settings

1. **Go to Netlify Dashboard** → Your Site → Site Settings → Build & deploy

2. **Update Build Settings:**
   ```
   Base directory: (leave empty or set to ".")
   Build command: npm ci && npm run build
   Publish directory: dist
   ```

3. **Or use the `netlify.toml` file** (already created in the repo root)

### Step 2: Set Environment Variables

In **Netlify Dashboard** → Site Settings → Environment Variables, add the values from your `prod.env` file:

```env
# EmailJS Configuration (get actual values from prod.env)
VITE_EMAILJS_PUBLIC_KEY = your_emailjs_public_key_here
VITE_EMAILJS_SERVICE_ID = your_emailjs_service_id_here
VITE_EMAILJS_USER_TEMPLATE = your_user_template_id_here
VITE_EMAILJS_ADMIN_TEMPLATE = your_admin_template_id_here

# Google Places Configuration (get actual values from prod.env)
VITE_GOOGLE_PLACES_API_KEY = your_google_places_api_key_here
VITE_GOOGLE_PLACES_PLACE_ID = your_google_places_place_id_here

# Social Media (get actual values from prod.env)
VITE_INSTAGRAM_HANDLE = your_instagram_handle
VITE_YOUTUBE_HANDLE = your_youtube_handle

# Application Configuration
VITE_NODE_ENV = production
VITE_LOG_LEVEL = error
VITE_SITE_URL = https://your-site-name.netlify.app

# Analytics (Optional - get actual values from prod.env)
VITE_GA_TRACKING_ID = your_ga_tracking_id_here
VITE_HOTJAR_ID = your_hotjar_id_here
VITE_GTM_ID = your_gtm_id_here
```

**🔒 Important**: Copy the actual values from your `prod.env` file, not these placeholders!

### Step 3: Deploy

1. **Commit the `netlify.toml` file:**
   ```bash
   git add netlify.toml docs/NETLIFY_DEPLOYMENT.md
   git commit -m "🚀 Add Netlify deployment configuration"
   git push
   ```

2. **Trigger new deployment** in Netlify Dashboard

## 🔧 Alternative: Manual Netlify Configuration

If you prefer to configure via Netlify UI instead of `netlify.toml`:

### Build Settings
- **Base directory**: (empty)
- **Build command**: `npm ci && npm run build`
- **Publish directory**: `dist`
- **Node version**: `18` (in Environment Variables)

### Deploy Settings
- **Branch to deploy**: `main`
- **Auto publishing**: Enabled

## 🧪 Testing the Deployment

After successful deployment, test these features:

1. **Contact Form**: Verify EmailJS integration works
2. **Google Reviews**: Check if Google Places reviews load
3. **Social Links**: Confirm Instagram/YouTube links work
4. **Responsive Design**: Test on mobile/tablet/desktop
5. **Performance**: Run Lighthouse audit

## 🚨 Common Issues & Fixes

### Issue: "vite: not found"
**Solution**: Use `npm ci && npm run build` instead of just `npm run build`

### Issue: Wrong base directory  
**Solution**: Set base to `.` or leave empty, NOT `public`

### Issue: Environment variables not loading
**Solution**: Ensure all `VITE_` prefixed variables are set in Netlify UI with actual values from `prod.env`

### Issue: 404 on page refresh
**Solution**: Add redirect rule in `netlify.toml` (already included)

### Issue: Build takes too long
**Solution**: Use `npm ci` instead of `npm install` for faster builds

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] `netlify.toml` configured
- [ ] All environment variables from `prod.env` set in Netlify UI
- [ ] Code committed and pushed to main branch
- [ ] Local build tested (`npm run build`)

### Post-Deployment  
- [ ] Site loads without errors
- [ ] Contact form sends emails
- [ ] Google Places reviews display
- [ ] All pages accessible (no 404s)
- [ ] Performance score > 90 (Lighthouse)
- [ ] Mobile responsiveness verified

## 🔒 Security Note

**Never commit sensitive values to Git!** Always:
- Use placeholder values in documentation
- Get actual values from your `prod.env` file
- Set real values only in Netlify's environment variables UI
- Keep `prod.env` file secure and never commit it

## 🔗 Quick Deploy Links

- **Netlify Dashboard**: https://app.netlify.com/
- **Site Settings**: Site Dashboard → Site Settings → Build & deploy
- **Environment Variables**: Site Settings → Environment variables
- **Deploy Log**: Site Dashboard → Deploys

## 🆘 If Still Having Issues

1. **Check deploy logs** in Netlify Dashboard
2. **Verify Node version** is 18+
3. **Ensure all dependencies** are in `package.json`
4. **Test local build**: `npm run build` should work locally
5. **Verify environment variables** are set with actual values from `prod.env`
6. **Contact support** with specific error messages

---

**Expected Result**: Clean deployment with all features working! 🚀 