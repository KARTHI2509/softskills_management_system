require('dotenv').config();
const nodemailer = require('nodemailer');
const dns = require('dns');

// Enforce IPv4 DNS resolution for cloud providers like Render that do not support outbound IPv6
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const DEFAULT_SMTP_USER = 'karthikthalipineni@gmail.com';
const DEFAULT_SMTP_PASS = 'rnosdmdxwgnmnsby';

async function resolveExplicitIpv4(hostname) {
  // If host is already an IP address, return it
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return hostname;
  try {
    const addresses = await dns.promises.resolve4(hostname);
    if (addresses && addresses.length > 0) {
      console.log(`[EMAIL SERVICE] Resolved ${hostname} to explicit IPv4 IP: ${addresses[0]}`);
      return addresses[0];
    }
  } catch (err) {
    console.warn(`[EMAIL SERVICE] IPv4 pre-resolution notice: ${err.message}`);
  }
  return hostname;
}

async function dispatchWithFallback(smtpHost, smtpPort, smtpUser, smtpPass, mailOptions) {
  // Pre-resolve host to an explicit IPv4 IP address string so Linux glibc/Node never attempts IPv6
  const targetHost = await resolveExplicitIpv4(smtpHost);

  // For Gmail SMTP or when port 465 is preferred, use Port 465 SSL directly to bypass cloud port 587 blocks
  const useSSLFirst = smtpHost.includes('gmail') || parseInt(smtpPort) === 465;
  const primaryPort = useSSLFirst ? 465 : parseInt(smtpPort || 587);
  const isSecure = primaryPort === 465;

  const primaryOptions = {
    host: targetHost,
    port: primaryPort,
    secure: isSecure,
    auth: { user: smtpUser, pass: smtpPass },
    tls: { rejectUnauthorized: false, servername: smtpHost },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000
  };

  try {
    const transporter = nodemailer.createTransport(primaryOptions);
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.warn(`[EMAIL SERVICE] Primary transport (port ${primaryPort}) notice: ${err.message}. Trying alternative port...`);
    const fallbackPort = primaryPort === 465 ? 587 : 465;
    const fallbackSecure = fallbackPort === 465;

    const fallbackOptions = {
      host: targetHost,
      port: fallbackPort,
      secure: fallbackSecure,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false, servername: smtpHost },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000
    };
    const fallbackTransporter = nodemailer.createTransport(fallbackOptions);
    return await fallbackTransporter.sendMail(mailOptions);
  }
}





module.exports = {
  /*
  Sends password recovery tokens.
  Params: recipientEmail (string), recoveryToken (string).
  Returns: Delivery status.
  */
  sendForgotPasswordEmail: async (recipientEmail, recoveryToken) => {
    console.log(`[EMAIL SERVICE] Initializing SMTP broadcast to: ${recipientEmail}`);
    
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER || DEFAULT_SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || DEFAULT_SMTP_PASS;

    const resetUrl = `http://localhost:3000/reset-password?token=${recoveryToken}`;

    try {
      const senderHeader = `"SkillForge Security" <${smtpUser}>`;

      const mailOptions = {
        from: senderHeader,
        to: recipientEmail,
        subject: 'Placement Readiness Portal - Password Reset Request',
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">SkillForge Account Assistance</h2>
            <p>You requested a password reset. Please click the button below to establish a new password credential:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 15px 0;">Reset Password</a>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">If you did not request this assistance, you can safely ignore this email.</p>
          </div>
        `
      };

      const info = await dispatchWithFallback(smtpHost, smtpPort, smtpUser, smtpPass, mailOptions);
      console.log(`[EMAIL SERVICE] SMTP dispatch complete to ${recipientEmail}. Msg ID: ${info.messageId}`);
      return {
        success: true,
        message: 'Password reset email dispatched successfully via SMTP.'
      };
    } catch (err) {
      console.error(`[EMAIL SERVICE] Nodemailer dispatch failed: ${err.message}`);
      console.log(`[EMAIL SERVICE] Reset URL (Fallback): ${resetUrl}`);
      return {
        success: false,
        message: 'SMTP dispatch failed, recovery fallback initiated.',
        error: err.message
      };
    }
  },

  /*
  Sends OTP Verification code.
  Params: recipientEmail (string), otpCode (string).
  Returns: Delivery status.
  */
  sendOTPEmail: async (recipientEmail, otpCode) => {
    console.log(`[EMAIL SERVICE] Initializing OTP broadcast to: ${recipientEmail}`);
    console.log(`[EMAIL SERVICE] *******************************************`);
    console.log(`[EMAIL SERVICE]   YOUR VERIFICATION OTP CODE: ${otpCode}`);
    console.log(`[EMAIL SERVICE] *******************************************`);
    
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER || DEFAULT_SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || DEFAULT_SMTP_PASS;

    try {
      const senderHeader = `"SkillForge Security" <${smtpUser}>`;

      const mailOptions = {
        from: senderHeader,
        to: recipientEmail,
        subject: 'Placement Readiness Portal - OTP Security Verification',
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">OTP Security Verification</h2>
            <p>You requested to change your password. Please verify using this OTP code:</p>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; border-radius: 8px; margin: 15px 0; color: #1e3a8a;">
              ${otpCode}
            </div>
            <p style="color: #666; font-size: 11px;">This code is valid for 10 minutes. If you did not request this action, please secure your credentials immediately.</p>
          </div>
        `
      };

      const info = await dispatchWithFallback(smtpHost, smtpPort, smtpUser, smtpPass, mailOptions);
      console.log(`[EMAIL SERVICE] OTP SMTP dispatch complete to ${recipientEmail}. Msg ID: ${info.messageId}`);
      return {
        success: true,
        message: `OTP verification email dispatched successfully to ${recipientEmail}.`
      };
    } catch (err) {
      console.error(`[EMAIL SERVICE] Nodemailer OTP dispatch failed: ${err.message}`);
      return {
        success: false,
        message: `SMTP dispatch failed: ${err.message}. OTP fallback printed to server logs.`,
        error: err.message
      };
    }
  }
};




