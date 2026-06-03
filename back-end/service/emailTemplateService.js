import sendEmail from './sendEmail.js';

const baseTemplate = (content) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .otp { font-size: 32px; letter-spacing: 5px; background: #f4f4f4; padding: 15px; text-align: center; font-weight: bold; }
      .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; margin: 20px 0; border-radius: 5px; }
      .footer { margin-top: 20px; font-size: 12px; color: #777; }
    </style>
  </head>
  <body>
    <div class="container">
      ${content}
      <div class="footer"><p>Election Control & Management System (ECMS)</p></div>
    </div>
  </body>
  </html>
`;

const emailTemplates = {
  verificationOTP: ({ otp }) => ({  
    subject: "Verify Your Email Address - ECMS",
    html: baseTemplate(`
      <h1>Welcome to ECMS!</h1>
      <p>Thank you for signing up. Please verify your email address using the OTP below:</p>
      <div class="otp">${otp}</div> 
      <p>This OTP expires in <strong>10 minutes</strong>.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `)
  }),

  resendOTP: ({ otp }) => ({  
    subject: "New Verification OTP - ECMS",
    html: baseTemplate(`
      <h1>Email Verification OTP</h1>
      <p>Your new verification OTP is:</p>
      <div class="otp">${otp}</div>
      <p>This OTP expires in <strong>10 minutes</strong>.</p>
    `)
  }),

  passwordReset: ({ resetURL }) => ({  
    subject: "Password Reset Request - ECMS",
    html: baseTemplate(`
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <a href="${resetURL}" class="button">Reset Password</a>
      <p>Or copy this link: <a href="${resetURL}">${resetURL}</a></p>
      <p>This link expires in <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `)
  })
};

export const sendEmailWithTemplate = async (email, templateName, data) => {
  const template = emailTemplates[templateName];
  if (!template) {
    throw new Error(`Email template "${templateName}" not found`);
  }
  
  const { subject, html } = template(data);
  
  return await sendEmail({
    email,
    subject,
    html
  });
};