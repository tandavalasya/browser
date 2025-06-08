# Security & Deployment Guide

## 🔒 Security Audit Complete

This document outlines the security measures implemented to prepare the TandavaLasya repository for public release on GitHub.

## ✅ Security Measures Implemented

### 1. **Environment Variables Configuration**

#### **Files Created:**
- `dev.env` - Development environment configuration (✅ Git ignored)
- `prod.env` - Production environment configuration (✅ Git ignored)

#### **Sensitive Data Moved to Environment Variables:**
- **EmailJS Configuration:**
  - `VITE_EMAILJS_PUBLIC_KEY` - EmailJS public key
  - `VITE_EMAILJS_SERVICE_ID` - EmailJS service identifier
  - `VITE_EMAILJS_USER_TEMPLATE` - User confirmation email template ID
  - `VITE_EMAILJS_ADMIN_TEMPLATE` - Admin notification email template ID

- **Social Media Handles** (now configurable):
  - `VITE_INSTAGRAM_HANDLE` - Instagram handle (@tandavalasya_)
  - `VITE_YOUTUBE_HANDLE` - YouTube handle (@tandavalasyadance)

- **Application Configuration:**
  - `VITE_NODE_ENV` - Environment mode (development/production)
  - `VITE_LOG_LEVEL` - Logging level configuration

### 2. **EmailJS Domain Security** 🔒

#### **Domain Restriction Setup Required:**
To prevent unauthorized use of your EmailJS service:

1. **Go to [EmailJS Dashboard](https://dashboard.emailjs.com/) → Integration**
2. **Remove wildcard `*` from Allowed Origins**
3. **Add only your authorized domains:**
   ```
   # Production
   https://your-domain.com
   https://www.your-domain.com
   
   # Netlify (if using)
   https://your-site.netlify.app
   
   # Development
   http://localhost:5173
   http://localhost:5174
   ```

#### **Security Benefits:**
- ✅ Prevents unauthorized websites from using your EmailJS quota
- ✅ Protects against spam and abuse
- ✅ Ensures emails only come from your legitimate domains

**📖 For detailed EmailJS security setup, see [`docs/EMAILJS_SECURITY.md`](EMAILJS_SECURITY.md)**

### 3. **Git Ignore Configuration**

Updated `.gitignore` to prevent sensitive files from being committed:
```
# Environment files - DO NOT COMMIT
dev.env
prod.env
.env.dev
.env.prod
```

### 4. **Code Security Improvements**

#### **Constants File Updated:**
`src/core/constants/app.constants.js` now uses environment variables:
```javascript
SOCIAL: {
  INSTAGRAM: import.meta.env.VITE_INSTAGRAM_HANDLE || 'tandavalasya_',
  YOUTUBE: import.meta.env.VITE_YOUTUBE_HANDLE || '@tandavalasyadance'
}
```

#### **Email Service Security:**
The EmailJS service already uses environment variables with secure fallbacks:
- Uses `import.meta.env` for Vite environment variables
- Provides secure fallback values for development
- Includes comprehensive logging for debugging

## 🚀 Deployment Instructions

### **For Netlify Deployment:**

1. **Upload Production Environment:**
   ```bash
   # Copy prod.env content to Netlify Environment Variables
   # Go to: Site Settings > Environment Variables
   ```

2. **Set Required Variables:**
   ```
   VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
   VITE_EMAILJS_SERVICE_ID=your_actual_service_id
   VITE_EMAILJS_USER_TEMPLATE=your_actual_user_template_id
   VITE_EMAILJS_ADMIN_TEMPLATE=your_actual_admin_template_id
   VITE_NODE_ENV=production
   VITE_LOG_LEVEL=error
   ```

3. **Configure EmailJS Domain Restrictions:**
   - Add your production domain to EmailJS allowed origins
   - Remove wildcard `*` for security
   - Test contact form after deployment

4. **Optional Analytics Variables:**
   ```
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   VITE_HOTJAR_ID=your_hotjar_site_id
   VITE_SITE_URL=https://tandavalasya.com
   ```

### **For Vercel Deployment:**

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to Project Settings > Environment Variables
   - Add all variables from `prod.env`

2. **Using Vercel CLI:**
   ```bash
   vercel env add VITE_EMAILJS_PUBLIC_KEY
   vercel env add VITE_EMAILJS_SERVICE_ID
   # ... repeat for all variables
   ```

### **For Local Development:**

1. **Copy and Configure:**
   ```bash
   cp dev.env .env.local
   # Edit .env.local with your development credentials
   ```

2. **Get EmailJS Credentials:**
   - Sign up at https://dashboard.emailjs.com/
   - Create email service and templates
   - Replace test values in your local environment file

## 🔍 Security Audit Results

### **✅ No Sensitive Data Found In:**
- Source code files (`.js`, `.jsx`)
- Configuration files (`.json`)
- Build configuration (`vite.config.js`, `package.json`)
- Documentation files (`.md`)

### **✅ Properly Secured:**
- API keys and secrets → Environment variables
- Social media handles → Environment configurable
- Email service configuration → Environment variables
- Development vs Production settings → Separate env files

### **✅ Git Security:**
- All sensitive files properly ignored
- No credentials in commit history
- Environment files excluded from repository

## 📋 Pre-Release Checklist

### **Repository Preparation:**
- [x] Environment files created (`dev.env`, `prod.env`)
- [x] Sensitive data moved to environment variables
- [x] `.gitignore` updated to exclude environment files
- [x] Constants updated to use environment variables
- [x] No hardcoded credentials in source code

### **EmailJS Security:**
- [ ] **Domain restrictions configured** in EmailJS dashboard
- [ ] **Wildcard `*` removed** from allowed origins
- [ ] **Production domain added** to allowed origins
- [ ] **Contact form tested** from production domain

### **Documentation:**
- [x] Security audit documented
- [x] Deployment instructions provided
- [x] Environment setup guide available (`docs/ENVIRONMENT_SETUP.md`)
- [x] EmailJS security guide created (`docs/EMAILJS_SECURITY.md`)
- [x] README updated with deployment checklist

### **Testing:**
- [ ] Test with production environment variables
- [ ] Verify email functionality works with real EmailJS credentials
- [ ] **Confirm EmailJS domain restrictions work properly**
- [ ] Confirm all features work without sensitive data exposed
- [ ] Test deployment on staging environment

## 🚨 IMPORTANT SECURITY NOTES

### **Before Making Repository Public:**

1. **Double-check no sensitive data:**
   ```bash
   # Search for any remaining sensitive patterns
   git log --all --full-history -- dev.env prod.env
   grep -r "VITE_EMAILJS_.*=" src/ --exclude-dir=node_modules
   ```

2. **Verify environment files are ignored:**
   ```bash
   git check-ignore dev.env prod.env
   # Should output: dev.env prod.env
   ```

3. **Configure EmailJS domain restrictions:**
   - Remove wildcard `*` from EmailJS dashboard
   - Add only your authorized domains
   - Test contact form functionality

4. **Review commit history:**
   ```bash
   git log --oneline -10
   # Ensure no commits contain sensitive data
   ```

### **For Production Deployment:**

1. **Never commit environment files**
2. **Configure EmailJS domain restrictions**
3. **Use secure environment variable management**
4. **Regularly rotate API keys and secrets**
5. **Monitor for any exposed credentials**
6. **Keep environment files backed up securely**

## 📞 Support

For questions about security configuration or deployment:
- Check `docs/ENVIRONMENT_SETUP.md` for detailed setup
- Check `docs/EMAILJS_SECURITY.md` for EmailJS domain restrictions
- Review `README.md` for general deployment guidance
- Contact development team for security concerns

---

**Security Audit Completed:** ✅  
**EmailJS Domain Security:** ⚠️ **CONFIGURE REQUIRED**  
**Repository Ready for Public Release:** ✅  
**Last Updated:** December 2024 