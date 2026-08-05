const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📨 Sending OTP...");
    console.log("📧 From:", process.env.EMAIL_USER);
    console.log("📩 To:", email);
    console.log("🔐 OTP:", otp);

    const info = await transporter.sendMail({
      from: `"Sentinel AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Sentinel AI Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>🛡️ Welcome to Sentinel AI</h2>

          <p>Your verification code is:</p>

          <h1 style="letter-spacing:6px;color:#2563eb;">
            ${otp}
          </h1>

          <p>This OTP expires in <b>10 minutes</b>.</p>

          <hr>

          <p style="font-size:12px;color:gray;">
            If you didn't request this email, please ignore it.
          </p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return true;
  } catch (error) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ Email Sending Failed!");
    console.error(error);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    throw error;
  }
};

module.exports = sendOTP;