# Contact Form Setup

The contact form is now configured to send emails directly to **info@lasatarah.co.ke** using PHP.

## How It Works

1. When a user submits the contact form, the data is sent to `send-email.php`
2. The PHP script validates the data and sends an email to info@lasatarah.co.ke
3. The email includes all form fields (name, email, phone, subject, message)
4. You can reply directly to the sender's email address

## Server Requirements

- **PHP 5.6 or higher** (PHP 7.4+ recommended)
- **mail() function enabled** on your web server
- Your webmail server must be configured to accept emails sent via PHP

## Testing

1. Upload all files to your web server (including `send-email.php`)
2. Make sure PHP is enabled on your server
3. Test the contact form on your website
4. Check info@lasatarah.co.ke inbox for the test email

## Troubleshooting

### Emails not being received?

1. **Check PHP mail() function**: Some hosting providers require specific configuration
2. **Check spam folder**: Emails might be going to spam
3. **Check server logs**: Look for PHP error logs
4. **Verify email address**: Make sure info@lasatarah.co.ke is correctly configured on your server

### If PHP mail() doesn't work:

You may need to configure SMTP settings. Contact your hosting provider or webmaster to:
- Configure SMTP settings for your domain
- Or use a library like PHPMailer for more reliable email delivery

## Alternative: Using PHPMailer (More Reliable)

If the basic PHP mail() function doesn't work reliably, you can use PHPMailer:

1. Download PHPMailer from: https://github.com/PHPMailer/PHPMailer
2. Update `send-email.php` to use PHPMailer with your SMTP settings
3. This provides better deliverability and error handling

## Security Notes

- The form includes basic validation (required fields, email format)
- Input is sanitized to prevent basic injection attacks
- For production, consider adding:
  - CAPTCHA to prevent spam
  - Rate limiting to prevent abuse
  - Additional server-side validation

