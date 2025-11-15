<?php
/**
 * Contact Form Email Handler (SMTP Version)
 * Sends contact form submissions to info@lasatarah.co.ke using SMTP
 * 
 * This version uses SMTP for more reliable email delivery.
 * You need to configure your SMTP settings below.
 */

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ============================================
// SMTP CONFIGURATION
// ============================================
// Configured for info@lasatarah.co.ke

define('SMTP_HOST', 'rs9.rcnoc.com');         // SMTP server
define('SMTP_PORT', 465);                      // SMTP port (465 for SSL)
define('SMTP_SECURE', 'ssl');                  // 'ssl' for port 465
define('SMTP_USERNAME', 'info@lasatarah.co.ke'); // Your email address
define('SMTP_PASSWORD', 'YOUR_EMAIL_PASSWORD');   // Your email account password - UPDATE THIS!
define('SMTP_FROM_EMAIL', 'info@lasatarah.co.ke'); // Email address to send from
define('SMTP_FROM_NAME', 'La Satarah Limited Website');

// ============================================
// IMPORTANT: Replace 'YOUR_EMAIL_PASSWORD' above with your actual email password
// ============================================

// Get and sanitize form data
$firstName = isset($_POST['first-name']) ? trim($_POST['first-name']) : '';
$lastName = isset($_POST['last-name']) ? trim($_POST['last-name']) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
if (empty($firstName) || empty($lastName) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// Map subject values to readable text
$subjectMap = [
    'product-inquiry' => 'Product Inquiry',
    'partnership' => 'Partnership Opportunity',
    'outgrower' => 'Outgrower Program',
    'export' => 'Export & Trade',
    'general' => 'General Inquiry',
    'other' => 'Other'
];
$subjectText = isset($subjectMap[$subject]) ? $subjectMap[$subject] : 'General Inquiry';

// Email configuration
$to = 'info@lasatarah.co.ke';
$emailSubject = 'New Contact Form Message: ' . $subjectText;

// Build email body
$emailBody = "You have received a new message from your website contact form.\n\n";
$emailBody .= "From: " . $firstName . " " . $lastName . "\n";
$emailBody .= "Email: " . $email . "\n";
$emailBody .= "Phone: " . ($phone ? $phone : 'Not provided') . "\n";
$emailBody .= "Subject: " . $subjectText . "\n\n";
$emailBody .= "Message:\n" . $message . "\n\n";
$emailBody .= "---\n";
$emailBody .= "This email was sent from the La Satarah Limited contact form.\n";
$emailBody .= "You can reply directly to this email to respond to " . $firstName . " " . $lastName . ".";

// Try to use PHPMailer if available, otherwise fall back to basic SMTP
if (file_exists(__DIR__ . '/PHPMailer/PHPMailer.php')) {
    // Using PHPMailer (more reliable)
    require_once __DIR__ . '/PHPMailer/PHPMailer.php';
    require_once __DIR__ . '/PHPMailer/SMTP.php';
    require_once __DIR__ . '/PHPMailer/Exception.php';
    
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';
        
        // Recipients
        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress($to);
        $mail->addReplyTo($email, $firstName . ' ' . $lastName);
        
        // Content
        $mail->isHTML(false);
        $mail->Subject = $emailSubject;
        $mail->Body = $emailBody;
        
        $mail->send();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. We will get back to you soon.'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly at info@lasatarah.co.ke'
        ]);
        error_log('PHPMailer Error: ' . $mail->ErrorInfo);
    }
} else {
    // Fallback to basic SMTP using stream_context
    $emailBodyHTML = nl2br(htmlspecialchars($emailBody));
    
    $headers = "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // Try to send using mail() function
    $mailSent = @mail($to, $emailSubject, $emailBody, $headers);
    
    if ($mailSent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. We will get back to you soon.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly at info@lasatarah.co.ke'
        ]);
    }
}
?>

