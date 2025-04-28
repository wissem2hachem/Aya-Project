const nodemailer = require('nodemailer');

// Enhanced email validation function
const isValidEmail = (email) => {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email address format');
  }
  return true;
};

// Create a transporter using Gmail with proper authentication
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  },
  debug: true // Enable debug mode
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service connection error:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});

const sendShortlistEmail = async (candidateEmail, candidateName, jobTitle) => {
  try {
    console.log('Attempting to send shortlist email to:', candidateEmail);
    
    // Basic email format validation
    try {
      isValidEmail(candidateEmail);
    } catch (error) {
      console.error('Email validation error:', error.message);
      throw new Error('Invalid email address format');
    }

    const mailOptions = {
      from: {
        name: 'Horizon Tech Recruitment',
        address: process.env.EMAIL_USER
      },
      to: candidateEmail,
      subject: 'Congratulations! Your Application Has Been Shortlisted',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #333; text-align: center;">Congratulations ${candidateName}!</h1>
          <p style="color: #555; font-size: 16px;">We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> has been shortlisted.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Next Steps:</h3>
            <ul style="color: #555;">
              <li>We will contact you shortly to schedule an interview</li>
              <li>Please ensure your contact information is up to date</li>
              <li>Be prepared to discuss your experience and qualifications in more detail</li>
            </ul>
          </div>
          
          <p style="color: #555; font-size: 14px;">If you have any questions, please don't hesitate to contact us.</p>
          <p style="color: #777; font-size: 14px;">Best regards,<br>The Recruitment Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Shortlist email sent successfully to:', candidateEmail, 'Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending shortlist email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    // More specific error messages
    if (error.code === 'EENVELOPE') {
      throw new Error('Failed to send email. Please check the email address and try again.');
    } else if (error.code === 'EAUTH') {
      throw new Error('Email service configuration error. Please contact support.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to email service. Please check your internet connection.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    // Validate email
    if (!isValidEmail(email)) {
      throw new Error('Invalid email address');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Reset your password by visiting this link: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #333; text-align: center;">Password Reset</h1>
          <p style="color: #555; font-size: 16px;">You requested a password reset. Please click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4a6cf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          
          <p style="color: #555; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; word-break: break-all; font-size: 14px;">${resetUrl}</p>
          
          <p style="color: #555; font-size: 14px;">This link will expire in 30 minutes.</p>
          <p style="color: #777; font-size: 14px;">If you did not request this, please ignore this email.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email, 'Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    if (error.code === 'EENVELOPE') {
      throw new Error('Invalid email address or recipient not found');
    } else if (error.code === 'EAUTH') {
      throw new Error('Email service authentication failed. Please check your email credentials.');
    } else {
      throw new Error('Failed to send email. Please try again later.');
    }
  }
};

module.exports = {
  sendShortlistEmail,
  sendPasswordResetEmail
}; 