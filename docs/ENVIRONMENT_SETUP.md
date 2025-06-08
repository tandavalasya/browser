# Environment Setup Guide

## Overview

This guide explains how to configure environment variables for the TandavaLasya Dance Academy website, focusing on EmailJS integration for the contact form functionality.

## Required Environment Variables

### EmailJS Configuration

The application requires the following environment variables for production deployment:

```bash
# EmailJS Configuration
# Get these values from your EmailJS dashboard: https://dashboard.emailjs.com/

# Your EmailJS Public Key (from Integration settings)
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here

# Your EmailJS Service ID (from Email Services)
VITE_EMAILJS_SERVICE_ID=your_service_id_here

# Template ID for user confirmation emails
VITE_EMAILJS_USER_TEMPLATE=your_user_template_id_here

# Template ID for admin notification emails
VITE_EMAILJS_ADMIN_TEMPLATE=your_admin_template_id_here
```

### Optional Environment Variables

```bash
# Analytics and tracking (optional)
VITE_GA_TRACKING_ID=your_google_analytics_id_here
VITE_HOTJAR_ID=your_hotjar_id_here

# Environment mode
VITE_NODE_ENV=production
```

## EmailJS Setup Instructions

### Step 1: Create EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service

1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the setup instructions for your provider
5. **Important**: Copy the **Service ID** - you'll need this for `VITE_EMAILJS_SERVICE_ID`

### Step 3: Create Email Templates

#### User Confirmation Template

1. Go to **Email Templates** → **Create New Template**
2. Use this template structure:

**Subject**: `Thank you for contacting TandavaLasya Dance Academy`

**Body**:
```html
<p>Dear {{from_name}},</p>

<p>Thank you for your interest in TandavaLasya Dance Academy! We have received your message:</p>

<blockquote style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #e91e63;">
  "{{message}}"
</blockquote>

<p><strong>Details:</strong></p>
<ul>
  <li><strong>Name:</strong> {{from_name}}</li>
  <li><strong>Email:</strong> {{from_email}}</li>
  <li><strong>Preferred Location:</strong> {{location}}</li>
  <li><strong>Submitted:</strong> {{submitted_at}}</li>
</ul>

<p>We will get back to you within 24 hours at {{from_email}}.</p>

<p>In the meantime, feel free to explore our <a href="https://tandavalasya.com/classes">class offerings</a> and learn more about our <a href="https://tandavalasya.com/about">instructors</a>.</p>

<p>Best regards,<br>
<strong>TandavaLasya Dance Academy Team</strong><br>
🕉️ Where Tradition Meets Passion</p>
```

3. **Important**: Copy the **Template ID** - you'll need this for `VITE_EMAILJS_USER_TEMPLATE`

#### Admin Notification Template

1. Create another new template for admin notifications

**Subject**: `New Contact Form Submission - TandavaLasya`

**Body**:
```html
<h2>New Contact Form Submission</h2>

<table style="border-collapse: collapse; width: 100%;">
  <tr style="background-color: #f9f9f9;">
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">{{from_name}}</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">{{from_email}}</td>
  </tr>
  <tr style="background-color: #f9f9f9;">
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Location:</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">{{location}}</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Submitted:</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">{{submitted_at}}</td>
  </tr>
  <tr style="background-color: #f9f9f9;">
    <td style="padding: 10px; border: 1px solid #ddd;"><strong>User Agent:</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd;">{{user_agent}}</td>
  </tr>
</table>

<h3>Message:</h3>
<div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #e91e63; margin: 15px 0;">
  {{message}}
</div>

<p><em>This is an automated message from the TandavaLasya contact form.</em></p>
```

2. **Important**: Copy the **Template ID** - you'll need this for `VITE_EMAILJS_ADMIN_TEMPLATE`

### Step 4: Get Public Key

1. Go to **Integration** in the EmailJS dashboard
2. Copy your **Public Key** - you'll need this for `VITE_EMAILJS_PUBLIC_KEY`

## Local Development Setup

### Create .env File

Create a `.env` file in your project root:

```bash
# Copy your values from EmailJS dashboard
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_USER_TEMPLATE=your_actual_user_template_id
VITE_EMAILJS_ADMIN_TEMPLATE=your_actual_admin_template_id
```

### Development Mode

If you don't configure environment variables, the app runs in development mode:
- Console shows: "EmailJS running in development mode - contact form will simulate email sending"
- Contact form validation works but emails aren't sent
- No errors or broken functionality

## Production Deployment

### Netlify Deployment

1. **Automatic Deployment**:
   - Connect your GitHub repository to Netlify
   - Netlify will auto-detect it's a Vite project

2. **Environment Variables**:
   - Go to your site's **Site Settings** → **Environment Variables**
   - Add each variable:
     ```
     VITE_EMAILJS_PUBLIC_KEY = your_actual_public_key
     VITE_EMAILJS_SERVICE_ID = your_actual_service_id
     VITE_EMAILJS_USER_TEMPLATE = your_actual_user_template_id
     VITE_EMAILJS_ADMIN_TEMPLATE = your_actual_admin_template_id
     ```

3. **Domain Configuration**:
   - In EmailJS dashboard, go to your service settings
   - Add your Netlify domain to allowed origins
   - Example: `https://your-site-name.netlify.app`

4. **Redeploy**: Trigger a new deployment after adding environment variables

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel

2. **Environment Variables**:
   - Go to **Project Settings** → **Environment Variables**
   - Add variables for all environments (Production, Preview, Development)

3. **Domain Configuration**: Add your Vercel domain to EmailJS allowed origins

### Other Platforms

**General Steps**:
1. Deploy the built files (`npm run build`)
2. Configure environment variables in your hosting platform
3. Add your domain to EmailJS allowed origins
4. Test the contact form functionality

## Testing Your Setup

### Local Testing

1. Start development server: `npm run dev`
2. Open contact form
3. Check browser console for EmailJS messages
4. Submit test form with valid data

### Production Testing

1. Deploy to your hosting platform
2. Visit your live site
3. Submit contact form with real email address
4. Verify both user confirmation and admin notification emails arrive
5. Check for any console errors

## Troubleshooting

### Common Issues

**Issue**: "EmailJS running in development mode" message
- **Solution**: Add environment variables to your `.env` file

**Issue**: Contact form submit button disabled
- **Solution**: Check console for validation errors, ensure EmailJS is properly initialized

**Issue**: Emails not sending in production
- **Solution**: 
  - Verify environment variables are set in hosting platform
  - Check EmailJS dashboard for usage limits
  - Ensure domain is added to allowed origins

**Issue**: "Service is not defined" error
- **Solution**: Check `VITE_EMAILJS_SERVICE_ID` is correctly set

**Issue**: Rate limiting errors
- **Solution**: Adjust rate limits in EmailJS dashboard or `email.service.js`

### Debug Mode

Enable debug logging by adding to your `.env`:
```bash
VITE_LOG_LEVEL=debug
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different EmailJS services** for development and production
3. **Set appropriate rate limits** in EmailJS dashboard
4. **Monitor EmailJS usage** regularly
5. **Rotate keys periodically** for security
6. **Use domain restrictions** in EmailJS settings

## Support

- **EmailJS Documentation**: https://www.emailjs.com/docs/
- **TandavaLasya Issues**: Check the project repository issues
- **Email Service Code**: `src/core/services/email.service.js`

---

**Last Updated**: June 2025  
**Version**: 1.0.0
