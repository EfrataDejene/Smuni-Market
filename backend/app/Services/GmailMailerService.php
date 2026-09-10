<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as PHPMailerException;
use Illuminate\Support\Facades\Log;

class GmailMailerService
{
    /**
     * Send a 6-digit OTP verification email via Gmail SMTP using PHPMailer.
     *
     * @param string $toEmail Recipient Gmail / Email address
     * @param string $recipientName Recipient's full name
     * @param string $otpCode 6-digit OTP code
     * @param string $role Account role (Customer, Seller, etc.)
     * @return array Result containing success status and message
     */
    public static function sendVerificationOtp(string $toEmail, string $recipientName, string $otpCode, string $role = 'customer'): array
    {
        $mail = new PHPMailer(true);

        try {
            $host = env('MAIL_HOST', 'smtp.gmail.com');
            $port = (int) env('MAIL_PORT', 587);
            $username = env('MAIL_USERNAME') ?: env('GMAIL_USER');
            $rawPassword = (string)(env('MAIL_PASSWORD') ?: env('GMAIL_APP_PASSWORD') ?: env('GMAIL_PASSWORD'));
            $password = str_replace(' ', '', trim($rawPassword));
            $encryption = strtolower((string) env('MAIL_ENCRYPTION', 'tls'));
            $fromAddress = env('MAIL_FROM_ADDRESS') ?: $username ?: 'no-reply@smunimarket.com';
            $fromName = env('MAIL_FROM_NAME', 'SMUNI-Market Ethiopia');

            // If credentials are configured, send via live Gmail SMTP
            if (!empty($username) && !empty($password)) {
                $mail->isSMTP();
                $mail->Host       = $host;
                $mail->SMTPAuth   = true;
                $mail->Username   = $username;
                $mail->Password   = $password;

                if ($port === 465 || $encryption === 'ssl') {
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                } else {
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                }

                $mail->Port       = $port;
                $mail->CharSet    = 'UTF-8';
                $mail->Timeout    = 15;

                // SSL options to ensure compatibility in local and production environments
                $mail->SMTPOptions = [
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    ]
                ];

                // Sender & Recipient
                $mail->setFrom($fromAddress, $fromName);
                $mail->addAddress($toEmail, $recipientName ?: 'SMUNI-Market User');
                $mail->addReplyTo($fromAddress, $fromName);

                // Content
                $mail->isHTML(true);
                $mail->Subject = "{$otpCode} is your SMUNI-Market Verification Code";
                $mail->Body    = self::renderVerificationHtmlTemplate($toEmail, $recipientName, $otpCode, $role);
                $mail->AltBody = "Hello " . ($recipientName ?: 'User') . ",\n\nYour 6-digit SMUNI-Market verification code is: {$otpCode}\n\nThis code will expire in 10 minutes. Enter this code on the verification screen to activate your account.\n\n© " . date('Y') . " SMUNI-Market Ethiopia.";

                $mail->send();

                self::logToConsole('SUCCESS', "✉️  OTP [{$otpCode}] successfully delivered to {$toEmail} via Gmail SMTP", [
                    'to' => $toEmail,
                    'code' => $otpCode,
                    'role' => $role,
                    'host' => $host,
                    'mode' => 'smtp_live'
                ]);

                return [
                    'success' => true,
                    'delivery_mode' => 'smtp_live',
                    'message' => 'Verification code delivered to Gmail inbox via PHPMailer SMTP.'
                ];
            } else {
                // If credentials are not yet set in .env, log OTP to terminal and storage
                self::logToConsole('WARNING', "⚠️  Gmail SMTP credentials not set in .env. Generated OTP [{$otpCode}] for {$toEmail} (Valid for 10 min)", [
                    'to' => $toEmail,
                    'code' => $otpCode,
                    'role' => $role,
                    'mode' => 'logged'
                ]);

                return [
                    'success' => true,
                    'delivery_mode' => 'logged',
                    'message' => 'OTP generated and logged (Set Gmail credentials in .env for live inbox delivery).'
                ];
            }
        } catch (PHPMailerException $e) {
            $err = $mail->ErrorInfo ?: $e->getMessage();
            self::logToConsole('ERROR', "❌ Failed to deliver OTP [{$otpCode}] to {$toEmail} via Gmail SMTP: {$err}", [
                'to' => $toEmail,
                'code' => $otpCode,
                'error' => $err
            ]);

            return [
                'success' => false,
                'error' => $err,
                'message' => 'Failed to deliver email through Gmail SMTP. Check your Gmail App Password credentials.'
            ];
        } catch (\Throwable $t) {
            self::logToConsole('ERROR', "❌ Unexpected exception sending OTP to {$toEmail}: " . $t->getMessage(), [
                'to' => $toEmail,
                'error' => $t->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $t->getMessage(),
                'message' => 'Unexpected error while attempting email dispatch.'
            ];
        }
    }

    /**
     * Send a 6-digit password reset OTP email via Gmail SMTP using PHPMailer.
     *
     * @param string $toEmail Recipient Gmail / Email address
     * @param string $recipientName Recipient's full name
     * @param string $otpCode 6-digit OTP code
     * @return array Result containing success status and message
     */
    public static function sendPasswordResetOtp(string $toEmail, string $recipientName, string $otpCode): array
    {
        $mail = new PHPMailer(true);

        try {
            $host = env('MAIL_HOST', 'smtp.gmail.com');
            $port = (int) env('MAIL_PORT', 587);
            $username = env('MAIL_USERNAME') ?: env('GMAIL_USER');
            $rawPassword = (string)(env('MAIL_PASSWORD') ?: env('GMAIL_APP_PASSWORD') ?: env('GMAIL_PASSWORD'));
            $password = str_replace(' ', '', trim($rawPassword));
            $encryption = strtolower((string) env('MAIL_ENCRYPTION', 'tls'));
            $fromAddress = env('MAIL_FROM_ADDRESS') ?: $username ?: 'no-reply@smunimarket.com';
            $fromName = env('MAIL_FROM_NAME', 'SMUNI-Market Security');

            // If credentials are configured, send via live Gmail SMTP
            if (!empty($username) && !empty($password)) {
                $mail->isSMTP();
                $mail->Host       = $host;
                $mail->SMTPAuth   = true;
                $mail->Username   = $username;
                $mail->Password   = $password;

                if ($port === 465 || $encryption === 'ssl') {
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                } else {
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                }

                $mail->Port       = $port;
                $mail->CharSet    = 'UTF-8';
                $mail->Timeout    = 15;

                // SSL options to ensure compatibility in local and production environments
                $mail->SMTPOptions = [
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    ]
                ];

                // Sender & Recipient
                $mail->setFrom($fromAddress, $fromName);
                $mail->addAddress($toEmail, $recipientName ?: 'SMUNI-Market User');
                $mail->addReplyTo($fromAddress, $fromName);

                // Content
                $mail->isHTML(true);
                $mail->Subject = "{$otpCode} is your SMUNI-Market Password Reset Code";
                $mail->Body    = self::renderPasswordResetHtmlTemplate($toEmail, $recipientName, $otpCode);
                $mail->AltBody = "Hello " . ($recipientName ?: 'User') . ",\n\nYour 6-digit SMUNI-Market password reset code is: {$otpCode}\n\nThis code will expire in 10 minutes. Use this code to securely create your new password.\n\nIf you did not request this password reset, please secure your account immediately.\n\n© " . date('Y') . " SMUNI-Market Ethiopia.";

                $mail->send();

                self::logToConsole('SUCCESS', "✉️  Password Reset OTP [{$otpCode}] successfully delivered to {$toEmail} via Gmail SMTP", [
                    'to' => $toEmail,
                    'code' => $otpCode,
                    'mode' => 'smtp_live'
                ]);

                return [
                    'success' => true,
                    'delivery_mode' => 'smtp_live',
                    'message' => 'Password reset code delivered to Gmail inbox via PHPMailer SMTP.'
                ];
            } else {
                // If credentials are not yet set in .env, log OTP to terminal and storage
                self::logToConsole('WARNING', "⚠️  Gmail SMTP credentials not set in .env. Generated Password Reset OTP [{$otpCode}] for {$toEmail} (Valid for 10 min)", [
                    'to' => $toEmail,
                    'code' => $otpCode,
                    'mode' => 'logged'
                ]);

                return [
                    'success' => true,
                    'delivery_mode' => 'logged',
                    'message' => 'Password reset OTP generated and logged (Set Gmail credentials in .env for live inbox delivery).'
                ];
            }
        } catch (PHPMailerException $e) {
            $err = $mail->ErrorInfo ?: $e->getMessage();
            self::logToConsole('ERROR', "❌ Failed to deliver Password Reset OTP [{$otpCode}] to {$toEmail} via Gmail SMTP: {$err}", [
                'to' => $toEmail,
                'code' => $otpCode,
                'error' => $err
            ]);

            return [
                'success' => false,
                'error' => $err,
                'message' => 'Failed to deliver email through Gmail SMTP. Check your Gmail App Password credentials.'
            ];
        } catch (\Throwable $t) {
            self::logToConsole('ERROR', "❌ Unexpected exception sending password reset OTP to {$toEmail}: " . $t->getMessage(), [
                'to' => $toEmail,
                'error' => $t->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $t->getMessage(),
                'message' => 'Unexpected error while attempting email dispatch.'
            ];
        }
    }

    /**
     * Print formatted colored log message to terminal console (STDERR/error_log) and Laravel log.
     */
    public static function logToConsole(string $type, string $message, array $details = []): void
    {
        // Write to Laravel's file log
        if ($type === 'ERROR') {
            Log::error("[SMUNI-OTP] " . $message, $details);
        } elseif ($type === 'WARNING') {
            Log::warning("[SMUNI-OTP] " . $message, $details);
        } else {
            Log::info("[SMUNI-OTP] " . $message, $details);
        }

        // Terminal ANSI color formatting
        $cyan = "\033[36m";
        $green = "\033[32m";
        $yellow = "\033[33m";
        $red = "\033[31m";
        $bold = "\033[1m";
        $reset = "\033[0m";

        $color = match($type) {
            'SUCCESS' => $green,
            'ERROR' => $red,
            'WARNING' => $yellow,
            default => $cyan
        };

        $timestamp = date('Y-m-d H:i:s');
        $detailsStr = !empty($details) ? ' | Details: ' . json_encode($details, JSON_UNESCAPED_SLASHES) : '';
        $line = "{$bold}{$color}[{$timestamp}] [SMUNI-OTP] [{$type}] {$message}{$reset}{$detailsStr}\n";

        // Print directly to console terminal stream for php artisan serve
        @file_put_contents('php://stderr', $line);
    }

    /**
     * Render a modern, mobile-responsive HTML email template optimized for Gmail.
     */
    public static function renderVerificationHtmlTemplate(string $toEmail, string $recipientName, string $otpCode, string $role = 'customer'): string
    {
        $currentYear = date('Y');
        $displayRole = strtolower($role) === 'seller' ? 'Merchant Store Account' : 'Customer Account';
        $safeName = htmlspecialchars($recipientName ?: 'User', ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($toEmail, ENT_QUOTES, 'UTF-8');

        return <<<HTML
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>{$otpCode} - SMUNI-Market Verification Code</title>
    <!--[if mso]>
    <style>
        * { font-family: sans-serif !important; }
    </style>
    <![endif]-->
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; }
            .fluid { max-width: 100% !important; height: auto !important; margin-left: auto !important; margin-right: auto !important; }
            .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
            .otp-code { font-size: 32px !important; letter-spacing: 6px !important; }
            .content-padding { padding: 24px 18px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; -webkit-font-smoothing: antialiased;">
    <center style="width: 100%; background-color: #f1f5f9; padding: 30px 10px;">
        <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="width: 560px;">
        <tr>
        <td>
        <![endif]-->

        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;" class="email-container">
            
            <!-- Brand Header -->
            <tr>
                <td style="background: linear-gradient(135deg, #0066D6 0%, #004db3 100%); padding: 32px 24px; text-align: center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td align="center">
                                <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 8px 18px; margin-bottom: 8px;">
                                    <span style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">SMUNI<span style="color: #93c5fd;">-Market</span></span>
                                </div>
                                <p style="margin: 4px 0 0 0; color: #dbeafe; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Ethiopia's Multi-Vendor Marketplace</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Main Body Content -->
            <tr>
                <td class="content-padding" style="padding: 36px 32px; background-color: #ffffff;">
                    
                    <!-- Verification Pill Badge -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                            🛡️ Gmail Account Verification
                        </span>
                    </div>

                    <!-- Heading -->
                    <h1 style="margin: 0 0 12px 0; color: #0f172a; font-size: 22px; font-weight: 800; text-align: center; line-height: 1.3;">
                        Verify Your Email Address
                    </h1>

                    <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
                        Hello <strong style="color: #1e293b;">{$safeName}</strong>, thank you for registering on SMUNI-Market for your <strong style="color: #0066D6;">{$displayRole}</strong>. Use the 6-digit verification code below to activate your account:
                    </p>

                    <!-- 6-Digit OTP Code Highlight Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px 0;">
                        <tr>
                            <td align="center" style="background-color: #f0f7ff; border: 2px dashed #93c5fd; border-radius: 16px; padding: 24px 16px;">
                                <span style="display: block; color: #1e40af; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                                    Your 6-Digit Verification Code
                                </span>
                                <div class="otp-code" style="font-family: 'Courier New', Courier, monospace, sans-serif; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #0066D6; text-align: center; margin: 4px 0;">
                                    {$otpCode}
                                </div>
                                <span style="display: inline-block; color: #64748b; font-size: 12px; font-weight: 600; margin-top: 8px;">
                                    ⏳ Valid for the next <strong style="color: #0f172a;">10 minutes</strong>
                                </span>
                            </td>
                        </tr>
                    </table>

                    <!-- Security Information Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px;">
                        <tr>
                            <td style="padding: 16px 18px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td valign="top" width="24" style="padding-right: 12px;">
                                            <span style="font-size: 16px;">🔒</span>
                                        </td>
                                        <td style="color: #64748b; font-size: 12px; line-height: 1.5;">
                                            <strong style="color: #334155;">Security Notice:</strong> Never share this 6-digit code with anyone. SMUNI-Market staff will never call or message you asking for your verification code.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                    <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5; text-align: center;">
                        If you did not attempt to register at SMUNI-Market with <span style="color: #64748b;">{$safeEmail}</span>, you can safely disregard this email.
                    </p>

                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center;">
                    <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px; font-weight: 700;">
                        SMUNI-Market Ethiopia
                    </p>
                    <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 11px;">
                        Bole Subcity, Addis Ababa, Ethiopia • Escrow Protected Marketplace
                    </p>
                    <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                        © {$currentYear} SMUNI-Market. All rights reserved.
                    </p>
                </td>
            </tr>

        </table>

        <!--[if mso | IE]>
        </td>
        </tr>
        </table>
        <![endif]-->
    </center>
</body>
</html>
HTML;
    }

    /**
     * Render a modern, mobile-responsive HTML email template for password reset.
     */
    public static function renderPasswordResetHtmlTemplate(string $toEmail, string $recipientName, string $otpCode): string
    {
        $currentYear = date('Y');
        $safeName = htmlspecialchars($recipientName ?: 'Valued User', ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($toEmail, ENT_QUOTES, 'UTF-8');

        return <<<HTML
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>{$otpCode} - SMUNI-Market Password Reset Code</title>
    <!--[if mso]>
    <style>
        * { font-family: sans-serif !important; }
    </style>
    <![endif]-->
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; }
            .fluid { max-width: 100% !important; height: auto !important; margin-left: auto !important; margin-right: auto !important; }
            .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
            .otp-code { font-size: 32px !important; letter-spacing: 6px !important; }
            .content-padding { padding: 24px 18px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; -webkit-font-smoothing: antialiased;">
    <center style="width: 100%; background-color: #f1f5f9; padding: 30px 10px;">
        <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="width: 560px;">
        <tr>
        <td>
        <![endif]-->

        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;" class="email-container">
            
            <!-- Brand Header -->
            <tr>
                <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td align="center">
                                <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 8px 18px; margin-bottom: 8px;">
                                    <span style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">SMUNI<span style="color: #38bdf8;">-Market</span></span>
                                </div>
                                <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Account Security & Recovery</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Main Body Content -->
            <tr>
                <td class="content-padding" style="padding: 36px 32px; background-color: #ffffff;">
                    
                    <!-- Reset Pill Badge -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="display: inline-block; background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                            🔑 Password Reset Request
                        </span>
                    </div>

                    <!-- Heading -->
                    <h1 style="margin: 0 0 12px 0; color: #0f172a; font-size: 22px; font-weight: 800; text-align: center; line-height: 1.3;">
                        Reset Your Password
                    </h1>

                    <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
                        Hello <strong style="color: #1e293b;">{$safeName}</strong>, we received a request to reset the password for your SMUNI-Market account associated with <strong style="color: #0066D6;">{$safeEmail}</strong>.
                    </p>

                    <!-- 6-Digit OTP Code Highlight Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px 0;">
                        <tr>
                            <td align="center" style="background-color: #f8fafc; border: 2px dashed #0066D6; border-radius: 16px; padding: 24px 16px;">
                                <span style="display: block; color: #0066D6; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                                    Your 6-Digit Reset Code
                                </span>
                                <div class="otp-code" style="font-family: 'Courier New', Courier, monospace, sans-serif; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #0f172a; text-align: center; margin: 4px 0;">
                                    {$otpCode}
                                </div>
                                <span style="display: inline-block; color: #64748b; font-size: 12px; font-weight: 600; margin-top: 8px;">
                                    ⏳ Valid for the next <strong style="color: #0f172a;">10 minutes</strong>
                                </span>
                            </td>
                        </tr>
                    </table>

                    <!-- Security Information Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px 0; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 14px;">
                        <tr>
                            <td style="padding: 16px 18px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td valign="top" width="24" style="padding-right: 12px;">
                                            <span style="font-size: 16px;">⚠️</span>
                                        </td>
                                        <td style="color: #92400e; font-size: 12px; line-height: 1.5;">
                                            <strong style="color: #78350f;">Important:</strong> If you did NOT request a password reset, please ignore this email or change your password immediately. Never share this code with anyone.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                    <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5; text-align: center;">
                        This automated message was sent to <span style="color: #64748b;">{$safeEmail}</span>.
                    </p>

                </td>
            </tr>

    /**
     * Send delivery driver account creation credentials email via Gmail SMTP.
     *
     * @param string $toEmail Recipient Gmail address
     * @param string $recipientName Courier full name
     * @param string $password Initial plain password
     * @param string $zone Assigned delivery zone
     * @param string $vehicle Vehicle details
     * @param string $phone Courier phone number
     * @return array
     */
    public static function sendDeliveryCredentialsEmail(string $toEmail, string $recipientName, string $password, string $zone = 'Addis Ababa', string $vehicle = 'Motorbike', string $phone = ''): array
    {
        $mail = new PHPMailer(true);

        try {
            $host = env('MAIL_HOST', 'smtp.gmail.com');
            $port = (int) env('MAIL_PORT', 587);
            $username = env('MAIL_USERNAME') ?: env('GMAIL_USER');
            $rawPassword = (string)(env('MAIL_PASSWORD') ?: env('GMAIL_APP_PASSWORD') ?: env('GMAIL_PASSWORD'));
            $smtpPassword = str_replace(' ', '', trim($rawPassword));
            $encryption = strtolower((string) env('MAIL_ENCRYPTION', 'tls'));
            $fromAddress = env('MAIL_FROM_ADDRESS') ?: $username ?: 'no-reply@smunimarket.com';
            $fromName = env('MAIL_FROM_NAME', 'SMUNI-Market Ethiopia Logistics');

            if (!empty($username) && !empty($smtpPassword)) {
                $mail->isSMTP();
                $mail->Host       = $host;
                $mail->SMTPAuth   = true;
                $mail->Username   = $username;
                $mail->Password   = $smtpPassword;

                if ($port === 465 || $encryption === 'ssl') {
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                } else {
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                }

                $mail->Port       = $port;
                $mail->CharSet    = 'UTF-8';
                $mail->Timeout    = 15;
                $mail->SMTPOptions = [
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    ]
                ];

                $mail->setFrom($fromAddress, $fromName);
                $mail->addAddress($toEmail, $recipientName ?: 'Delivery Courier');
                $mail->addReplyTo($fromAddress, $fromName);

                $mail->isHTML(true);
                $mail->Subject = "🚴 SMUNI-Market Courier Account Created — Your Driver Login Credentials";
                $mail->Body    = self::renderDeliveryCredentialsHtmlTemplate($toEmail, $recipientName, $password, $zone, $vehicle, $phone);
                $mail->AltBody = "Hello {$recipientName},\n\nYour SMUNI-Market delivery personnel account has been created by the Administrator.\n\nYour Login Credentials:\n- Portal: Delivery Driver Portal\n- Email: {$toEmail}\n- Password: {$password}\n- Assigned Zone: {$zone}\n- Vehicle: {$vehicle}\n\nPlease sign in at the SMUNI Delivery Portal to access your assigned orders.\n\n© " . date('Y') . " SMUNI-Market Ethiopia.";

                $mail->send();

                self::logToConsole('SUCCESS', "🚴 Courier onboarding credentials delivered to {$toEmail} via Gmail SMTP", [
                    'to' => $toEmail,
                    'name' => $recipientName,
                    'zone' => $zone,
                    'mode' => 'smtp_live'
                ]);

                return [
                    'success' => true,
                    'delivery_mode' => 'smtp_live',
                    'message' => 'Courier credentials delivered to Gmail inbox.'
                ];
            } else {
                self::logToConsole('WARNING', "⚠️ Gmail SMTP not configured. Logged Courier credentials for {$toEmail}", [
                    'to' => $toEmail,
                    'name' => $recipientName,
                    'password' => $password,
                    'mode' => 'logged'
                ]);

                return [
                    'success' => true,
                    'delivery_mode' => 'logged',
                    'message' => 'Courier credentials generated and logged.'
                ];
            }
        } catch (\Throwable $t) {
            self::logToConsole('ERROR', "❌ Failed to send courier credentials to {$toEmail}: " . $t->getMessage());
            return [
                'success' => false,
                'error' => $t->getMessage(),
                'message' => 'Could not dispatch credentials email.'
            ];
        }
    }

    /**
     * Render HTML template for Delivery Courier Onboarding Credentials email.
     */
    private static function renderDeliveryCredentialsHtmlTemplate(
        string $toEmail,
        string $recipientName,
        string $password,
        string $zone,
        string $vehicle,
        string $phone
    ): string {
        $safeName    = htmlspecialchars($recipientName ?: 'Delivery Courier', ENT_QUOTES, 'UTF-8');
        $safeEmail   = htmlspecialchars($toEmail, ENT_QUOTES, 'UTF-8');
        $safePass    = htmlspecialchars($password, ENT_QUOTES, 'UTF-8');
        $safeZone    = htmlspecialchars($zone, ENT_QUOTES, 'UTF-8');
        $safeVehicle = htmlspecialchars($vehicle, ENT_QUOTES, 'UTF-8');
        $currentYear = date('Y');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SMUNI-Market Driver Credentials</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <center style="width: 100%; background-color: #f1f5f9; padding: 32px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);">
            <!-- Header Banner -->
            <tr>
                <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 36px 30px; text-align: center;">
                    <span style="display: inline-block; background-color: #f97316; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                        🚴 Logistics & Fleet Team
                    </span>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">
                        SMUNI<span style="color: #f97316;">-Market</span> Delivery
                    </h1>
                    <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 13px;">Official Delivery Courier Credentials</p>
                </td>
            </tr>

            <!-- Main Content -->
            <tr>
                <td style="padding: 32px 28px;">
                    <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">
                        Welcome to the Fleet, {$safeName}!
                    </p>
                    <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                        Your courier profile has been activated by the SMUNI-Market Administrator. You can now sign in to the delivery dashboard to receive live dispatches, track orders, and manage cash collection.
                    </p>

                    <!-- Credentials Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 24px;">
                        <tr>
                            <td style="padding: 20px;">
                                <div style="margin-bottom: 12px; font-size: 13px; color: #64748b;">
                                    <strong style="color: #0f172a;">Login Gmail:</strong> <span style="font-family: monospace; color: #0284c7; font-weight: 700;">{$safeEmail}</span>
                                </div>
                                <div style="margin-bottom: 12px; font-size: 13px; color: #64748b;">
                                    <strong style="color: #0f172a;">Password:</strong> <span style="font-family: monospace; background: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 6px; font-weight: 800;">{$safePass}</span>
                                </div>
                                <div style="margin-bottom: 12px; font-size: 13px; color: #64748b;">
                                    <strong style="color: #0f172a;">Assigned Zone:</strong> {$safeZone}
                                </div>
                                <div style="font-size: 13px; color: #64748b;">
                                    <strong style="color: #0f172a;">Vehicle & Plate:</strong> {$safeVehicle}
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
                        <span style="font-size: 12px; color: #15803d; font-weight: 600;">
                            ✅ Your account is verified and ready for instant login.
                        </span>
                    </div>

                    <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                        Keep your password safe. If you did not expect this email, contact system administrator.
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center;">
                    <p style="margin: 0; color: #64748b; font-size: 11px;">
                        © {$currentYear} SMUNI-Market Ethiopia Logistics. All rights reserved.
                    </p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
HTML;
    }
}

