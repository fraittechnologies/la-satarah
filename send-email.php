<?php
/**
 * Contact Form Email Handler with SMTP Support
 * Sends contact form submissions to info@lasatarah.co.ke
 * 
 * Configured for: info@lasatarah.co.ke
 * SMTP Server: rs9.rcnoc.com:465 (SSL)
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
$smtp_config = [
    'host' => 'rs9.rcnoc.com',
    'port' => 465,
    'secure' => 'ssl',  // 'ssl' for port 465
    'username' => 'info@lasatarah.co.ke',
    'password' => 'info@lasatarah2025!', // REPLACE THIS with your actual email password
    'from_email' => 'info@lasatarah.co.ke',
    'from_name' => 'La Satarah Limited Website'
];
// ============================================

// Simple SMTP class for sending emails
class SimpleSMTP {
    private $host;
    private $port;
    private $secure;
    private $username;
    private $password;
    private $socket;
    
    public function __construct($host, $port, $secure, $username, $password) {
        $this->host = $host;
        $this->port = $port;
        $this->secure = $secure;
        $this->username = $username;
        $this->password = $password;
    }
    
    public function connect() {
        $context = stream_context_create();
        if ($this->secure === 'ssl') {
            $this->socket = @stream_socket_client(
                "ssl://{$this->host}:{$this->port}",
                $errno,
                $errstr,
                30,
                STREAM_CLIENT_CONNECT,
                $context
            );
        } else {
            $this->socket = @stream_socket_client(
                "{$this->host}:{$this->port}",
                $errno,
                $errstr,
                30,
                STREAM_CLIENT_CONNECT,
                $context
            );
        }
        
        if (!$this->socket) {
            return false;
        }
        
        $response = fgets($this->socket, 515);
        return substr($response, 0, 3) == '220';
    }
    
    public function sendCommand($command, $expectedCode) {
        fputs($this->socket, $command . "\r\n");
        $response = fgets($this->socket, 515);
        return substr($response, 0, 3) == $expectedCode;
    }
    
    public function authenticate() {
        if (!$this->sendCommand('EHLO ' . $this->host, '250')) {
            return false;
        }
        
        if (!$this->sendCommand('AUTH LOGIN', '334')) {
            return false;
        }
        
        if (!$this->sendCommand(base64_encode($this->username), '334')) {
            return false;
        }
        
        if (!$this->sendCommand(base64_encode($this->password), '235')) {
            return false;
        }
        
        return true;
    }
    
    public function sendEmail($from, $to, $subject, $body, $headers) {
        if (!$this->sendCommand("MAIL FROM: <{$from}>", '250')) {
            return false;
        }
        
        if (!$this->sendCommand("RCPT TO: <{$to}>", '250')) {
            return false;
        }
        
        if (!$this->sendCommand('DATA', '354')) {
            return false;
        }
        
        $email = "Subject: {$subject}\r\n";
        $email .= $headers . "\r\n";
        $email .= "\r\n{$body}\r\n";
        $email .= ".\r\n";
        
        fputs($this->socket, $email);
        $response = fgets($this->socket, 515);
        
        return substr($response, 0, 3) == '250';
    }
    
    public function disconnect() {
        if ($this->socket) {
            $this->sendCommand('QUIT', '221');
            fclose($this->socket);
        }
    }
}

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

// Email headers
$headers = "From: " . $smtp_config['from_name'] . " <" . $smtp_config['from_email'] . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Try sending via SMTP first
$mailSent = false;
if ($smtp_config['password'] !== 'YOUR_EMAIL_PASSWORD') {
    $smtp = new SimpleSMTP(
        $smtp_config['host'],
        $smtp_config['port'],
        $smtp_config['secure'],
        $smtp_config['username'],
        $smtp_config['password']
    );
    
    if ($smtp->connect() && $smtp->authenticate()) {
        $mailSent = $smtp->sendEmail(
            $smtp_config['from_email'],
            $to,
            $emailSubject,
            $emailBody,
            $headers
        );
        $smtp->disconnect();
    }
}

// Fallback to PHP mail() if SMTP fails or password not set
if (!$mailSent) {
    $mailSent = @mail($to, $emailSubject, $emailBody, $headers);
}

// Send response
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
        'message' => 'Sorry, there was an error sending your message. Please make sure the email password is configured correctly, or contact us directly at info@lasatarah.co.ke'
    ]);
}
?>
