<?php
/**
 * contact.php — Forge Fitness Studio contact form handler
 *
 * Receives POST data from contact.html, validates it server-side
 * (never trust client-side JS validation alone), and emails the
 * enquiry to the studio inbox. Returns a short plain-text response
 * that js/main.js reads via fetch(); falls back to a normal
 * redirect-based response if JS is disabled.
 *
 * SETUP NOTE FOR SUBMISSION / DEPLOYMENT:
 * mail() requires a configured mail server (works out of the box on
 * most shared/student hosting, e.g. via cPanel). On a local XAMPP/WAMP
 * setup without SMTP configured, mail() will fail silently — for local
 * testing you can temporarily replace the mail() call below with a
 * file_put_contents() write to a log file to confirm the form pipeline
 * works end to end.
 */

header('Content-Type: text/plain; charset=utf-8');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'This endpoint only accepts form submissions.';
    exit;
}

// --- Collect and sanitise input -------------------------------------
$name    = isset($_POST['name'])    ? trim(strip_tags($_POST['name']))    : '';
$email   = isset($_POST['email'])   ? trim($_POST['email'])               : '';
$phone   = isset($_POST['phone'])   ? trim(strip_tags($_POST['phone']))   : '';
$goal    = isset($_POST['goal'])    ? trim(strip_tags($_POST['goal']))    : 'Not specified';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// --- Server-side validation ------------------------------------------
$errors = array();

if (strlen($name) < 2) {
    $errors[] = 'Please enter your full name.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if ($phone !== '' && !preg_match('/^[0-9+\s()-]{7,}$/', $phone)) {
    $errors[] = 'Please enter a valid phone number.';
}

if (strlen($message) < 10) {
    $errors[] = 'Please include a short message (at least 10 characters).';
}

if (!empty($errors)) {
    http_response_code(422);
    echo implode(' ', $errors);
    exit;
}

// --- Build and send the email -----------------------------------------
$to      = 'hello@forgefitness.co.za';
$subject = 'New enquiry from forgefitness.co.za — ' . $name;

$body  = "New contact form submission\n";
$body .= "----------------------------\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Phone: " . ($phone !== '' ? $phone : 'Not provided') . "\n";
$body .= "Interested in: {$goal}\n\n";
$body .= "Message:\n{$message}\n";

$headers   = array();
$headers[] = 'From: Forge Fitness Website <no-reply@forgefitness.co.za>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Content-Type: text/plain; charset=utf-8';

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    http_response_code(200);
    echo 'Thanks, ' . $name . ' — your message has been sent. We will reply within one business day.';
} else {
    // mail() failing is common on local dev environments without SMTP set up.
    http_response_code(500);
    echo 'Your message was received but could not be emailed automatically. Please call the studio directly.';
}
