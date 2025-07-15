# SMTP Email Setup Guide for Cybersecurity Assessment

This guide will help you set up SMTP email functionality to send professional emails to users who complete the cybersecurity assessment.

## 🔧 Environment Variables Setup

Create or update your `.env.local` file with the following variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=alexander.b@skilloncall.com
SMTP_PASS=aexhegneqyorzdjh
FROM_EMAIL=alexander.b@skilloncall.com

# Optional: Default user email for testing
USER_EMAIL=alexander.b@skilloncall.com
```

## 📧 Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Click "Create new app password"
5. Select "Mail" as the app
6. Copy the generated 16-character password

### Step 3: Update Environment Variables
Replace `your-app-password` in your `.env.local` file with the generated app password.

## 🚀 Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
```

## 📋 Email Templates

The application includes two email templates:

### 1. User Email Template (`/api/send-user-email.ts`)
- **Purpose**: Professional email sent to users who complete the assessment
- **Features**:
  - Forvis Mazars branding
  - Assessment details summary
  - Score display
  - Next steps information
  - Contact information
  - Professional styling

### 2. Internal Notification (`/api/send-assessment.ts`)
- **Purpose**: Internal notification to your team
- **Features**:
  - Complete assessment details
  - All question and answer pairs
  - Client information
  - Score summary

## 🔄 How It Works

1. **User completes assessment** → Form submits data
2. **Internal notification sent** → Team receives detailed assessment data
3. **User email sent** → Professional follow-up email to user
4. **Thank you message displayed** → User sees confirmation on screen

## 🛠️ Customization Options

### Update User Email Address
To send emails to the actual user, you'll need to:

1. **Add email field to personal info form**:
   ```typescript
   // In components/cybersecurity-assessment-form.tsx
   const [personalInfo, setPersonalInfo] = useState({
     // ... existing fields
     email: "", // Add this field
   });
   ```

2. **Update the email API**:
   ```typescript
   // In pages/api/send-user-email.ts
   const userEmail = personalInfo.email || process.env.USER_EMAIL;
   ```

### Customize Email Content
Edit the email templates in:
- `/pages/api/send-user-email.ts` - User-facing email
- `/pages/api/send-assessment.ts` - Internal notification

### Update Branding
Replace the Forvis Mazars logo URL with your own:
```html
<img src="your-logo-url" alt="Your Company Logo" class="logo">
```

## 🧪 Testing

### Test Email Configuration
1. Set up environment variables
2. Complete the assessment
3. Check your email inbox
4. Verify both internal and user emails are sent

### Debug Email Issues
Check the browser console and server logs for error messages:
```javascript
console.error("Error sending email:", error);
```

## 📦 Dependencies

Make sure you have the required dependencies installed:
```bash
npm install nodemailer
npm install @types/nodemailer --save-dev
```

## 🔒 Security Considerations

1. **Never commit `.env.local`** to version control
2. **Use app passwords** instead of regular passwords
3. **Enable 2FA** on your email account
4. **Regularly rotate** app passwords
5. **Monitor email sending** for unusual activity

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Verify app password is correct
   - Ensure 2FA is enabled
   - Check email address spelling

2. **"Connection timeout" error**
   - Verify SMTP host and port
   - Check firewall settings
   - Try different SMTP settings

3. **"Authentication failed" error**
   - Regenerate app password
   - Check SMTP credentials
   - Verify email provider settings

### Debug Steps
1. Check environment variables are loaded
2. Verify SMTP configuration
3. Test with a simple email first
4. Check server logs for detailed errors

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your email provider's SMTP settings
3. Test with a different email provider
4. Review server logs for detailed error messages

---

**Note**: This setup uses Gmail as an example. Adjust the SMTP settings according to your email provider's requirements. 