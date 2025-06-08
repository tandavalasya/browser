# EmailJS Domain Security Guide

## 🚨 CRITICAL: Secure Your EmailJS Service

By default, EmailJS allows emails from **any domain** using your public key. This guide shows you how to restrict it to **only your authorized domains**.

## 🔒 Why Domain Restrictions Are Essential

### Without Domain Restrictions:
- ❌ **Anyone can use your EmailJS quota** from any website
- ❌ **Spam and abuse** can exhaust your monthly limit
- ❌ **Potential security vulnerabilities** from unauthorized access
- ❌ **Unexpected costs** if you upgrade to paid plans

### With Domain Restrictions:
- ✅ **Only your domains** can send emails through your service
- ✅ **Protected from abuse** and unauthorized usage
- ✅ **Better quota management** and cost control
- ✅ **Enhanced security** for your email service

## 📋 Step-by-Step Configuration

### Step 1: Access EmailJS Dashboard
1. Go to **[EmailJS Dashboard](https://dashboard.emailjs.com/)**
2. **Sign in** to your account
3. Navigate to **"Integration"** section (left sidebar)

### Step 2: Configure Domain Restrictions
1. In the **Integration tab**, find **"Allowed Origins"** section
2. **IMPORTANT**: Remove the wildcard `*` entry (if present)
3. Click **"Add Origin"** and add your specific domains

### Step 3: Add Your Domains

**For TandavaLasya Project, add these domains:**

```
# Production Domain (replace with your actual domain)
https://tandavalasya.com
https://www.tandavalasya.com

# Netlify Deployment (if using Netlify)
https://your-netlify-site-name.netlify.app

# Development (for local testing)
http://localhost:5173
http://localhost:5174
http://127.0.0.1:5173
http://127.0.0.1:5174
```

### Step 4: Save and Test
1. Click **"Save"** to apply the restrictions
2. **Test immediately** from your authorized domains
3. **Verify restriction** by testing from unauthorized domain

## 🌐 Domain Format Requirements

### ✅ Correct Format Examples:
```
https://tandavalasya.com          ← Production
https://www.tandavalasya.com      ← WWW subdomain  
https://app.netlify.com           ← Netlify
http://localhost:5173             ← Local development
http://127.0.0.1:5173            ← Local IP
```

### ❌ Incorrect Formats:
```
tandavalasya.com                  ← Missing protocol
https://tandavalasya.com/         ← Trailing slash
localhost:5173                    ← Missing protocol
*.tandavalasya.com               ← Wildcards not supported
```

### 🔑 Format Rules:
- ✅ **Include protocol** (`http://` or `https://`)
- ✅ **Exact domain match** (no wildcards)
- ✅ **Specific port numbers** for localhost
- ✅ **No trailing slashes**
- ✅ **Include all subdomains** you use (www, app, etc.)

## 🧪 Testing Your Configuration

### Test 1: Authorized Domain ✅
1. **Deploy your site** to authorized domain
2. **Submit contact form**
3. **Expected result**: Form works normally
4. **Check email**: Should receive confirmation emails

### Test 2: Unauthorized Domain ❌
1. **Try from different domain** (or localhost without restriction)
2. **Submit contact form**
3. **Expected result**: CORS error in browser console
4. **Console error should show**:
   ```
   Access to fetch at 'https://api.emailjs.com/api/v1.0/email/send' 
   from origin 'https://unauthorized-domain.com' has been blocked by CORS policy
   ```

### Test 3: Development Environment ✅
1. **Start local development server** (`npm run dev`)
2. **Ensure localhost:5173 is in allowed origins**
3. **Test contact form locally**
4. **Expected result**: Should work from localhost

## 🚨 Common Issues & Solutions

### Issue: CORS Error After Adding Restrictions
**Symptoms**: Contact form stops working, console shows CORS error  
**Cause**: Current domain not in allowed origins list  
**Solution**: 
1. Add exact domain (with protocol) to EmailJS allowed origins
2. Save configuration
3. Clear browser cache and test again

### Issue: Works Locally But Not in Production
**Symptoms**: Form works on localhost but fails after deployment  
**Cause**: Production domain not added to allowed origins  
**Solution**: Add production domain to EmailJS dashboard

### Issue: Inconsistent Behavior
**Symptoms**: Form works sometimes but not always  
**Cause**: Multiple domains/subdomains in use  
**Solution**: Add ALL domains your site uses:
- Main domain (`https://example.com`)
- WWW subdomain (`https://www.example.com`) 
- Staging/preview domains
- CDN domains if applicable

## 🔧 Advanced Security Configuration

### 1. Environment-Specific Restrictions
```
# Development
http://localhost:5173
http://localhost:5174

# Staging  
https://staging.tandavalasya.com

# Production
https://tandavalasya.com
https://www.tandavalasya.com
```

### 2. Multiple Deployment Platforms
```
# Netlify
https://your-site.netlify.app
https://your-custom-domain.com

# Vercel  
https://your-project.vercel.app
https://your-custom-domain.com

# GitHub Pages
https://username.github.io
```

### 3. Content Security Policy (Optional)
Add to your site's security headers:
```
Content-Security-Policy: connect-src 'self' https://api.emailjs.com;
```

## 💡 Best Practices

### 1. Principle of Least Privilege
- ✅ **Only add domains you actually use**
- ✅ **Remove test/staging domains** after testing
- ✅ **Regularly audit** your allowed origins list

### 2. Development Workflow
- ✅ **Add localhost** for development
- ✅ **Add staging domain** for testing
- ✅ **Add production domain** before deployment
- ✅ **Remove unnecessary domains** after project completion

### 3. Documentation
- ✅ **Document all authorized domains** in your project
- ✅ **Include domain restrictions** in deployment checklist
- ✅ **Update team members** about domain requirements

### 4. Monitoring
- ✅ **Monitor EmailJS usage** in dashboard
- ✅ **Set up alerts** for quota limits
- ✅ **Regular security reviews** of allowed origins

## 🔍 Security Checklist

### EmailJS Dashboard Configuration:
- [ ] **Logged into EmailJS dashboard**
- [ ] **Navigated to Integration section**
- [ ] **Wildcard `*` removed** from allowed origins
- [ ] **Production domain added** (with and without www)
- [ ] **Staging/development domains added** as needed
- [ ] **Localhost added** for development
- [ ] **Configuration saved**

### Testing Verification:
- [ ] **Contact form tested** from production domain ✅
- [ ] **Contact form tested** from localhost ✅  
- [ ] **CORS error confirmed** from unauthorized domain ❌
- [ ] **Email delivery confirmed** for authorized domains
- [ ] **Error handling working** for unauthorized access

### Documentation Updated:
- [ ] **Deployment docs updated** with domain requirements
- [ ] **Team notified** about domain restrictions
- [ ] **Security audit** includes EmailJS restrictions
- [ ] **README updated** with domain setup instructions

## 📞 Support & Troubleshooting

### If You Need Help:
1. **Check EmailJS documentation**: https://www.emailjs.com/docs/
2. **Review browser console** for specific error messages
3. **Test with simple domain** first (no subdomains)
4. **Verify exact spelling** of domains in dashboard

### Emergency Access:
If you're locked out and need immediate access:
1. **Temporarily add wildcard `*`** to allowed origins
2. **Test and identify correct domain** format
3. **Replace wildcard with specific domain** immediately
4. **Never leave wildcard in production!**

## 🚀 Quick Setup for TandavaLasya

### 1. EmailJS Dashboard Setup:
```
Allowed Origins:
✅ https://tandavalasya.com
✅ https://www.tandavalasya.com  
✅ https://your-netlify-site.netlify.app
✅ http://localhost:5173
```

### 2. Test After Configuration:
- Contact form from production domain
- Email delivery confirmation
- CORS protection from unauthorized domains

### 3. Production Deployment:
- Verify domain restrictions active
- Monitor email quota usage
- Regular security reviews

---

**🔒 Your EmailJS service is now secured to work only from your authorized domains!**

**Next Steps:** Update your deployment checklist to include EmailJS domain verification before going live. 