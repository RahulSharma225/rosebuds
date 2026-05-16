const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, name) => {
  try {
    console.log(`\n📧 OTP for ${email}: ${otp} (Valid for 15 minutes)\n`);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "🔐 Your Rose Buds Portal Login OTP",
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #f8f5f6; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a0a10; margin: 0;">🌹 Rose Buds Public School</h1>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">Secure Portal Access</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1a0a10; font-size: 18px; margin-bottom: 15px;">Hello ${name},</h2>
            
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Your One-Time Password (OTP) for logging into the Rose Buds Portal is:
            </p>
            
            <div style="background: linear-gradient(135deg, #e8355a, #c0234a); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0;">
                ${otp}
              </p>
            </div>
            
            <p style="color: #999; font-size: 13px; margin: 20px 0;">
              ⏱️ This OTP is valid for <strong>15 minutes</strong>
            </p>
            
            <div style="background: #fef3e2; border-left: 4px solid #f39c12; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #c67c0e; font-size: 13px; margin: 0;">
                <strong>🔒 Security Notice:</strong> Never share this OTP with anyone. Rose Buds staff will never ask for your OTP.
              </p>
            </div>
            
            <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 20px 0;">
              If you did not attempt to log in, please ignore this email or contact our support team immediately.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2026 Rose Buds Public School. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Email sending error:", err);
    throw new Error("Failed to send OTP");
  }
};

// Placeholder for SMS service (can integrate Twilio later)
const sendOTPSMS = async (phone, otp) => {
  try {
    console.log(`SMS OTP for ${phone}: ${otp}`);
    // TODO: Integrate Twilio or another SMS service
    return { success: true };
  } catch (err) {
    console.error("SMS sending error:", err);
    throw new Error("Failed to send SMS OTP");
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendOTPSMS,
};
