require("dotenv").config();
const nodemailer = require("nodemailer");

async function test() {
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ loaded" : "❌ missing");
  console.log("NOTIFY_EMAIL:", process.env.NOTIFY_EMAIL);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified!");

    await transporter.sendMail({
      from: `"Trivoxa Website" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: "✅ Test Email from Trivoxa",
      text: "This is a test email. Your contact form email is working!",
    });

    console.log("✅ Test email sent to", process.env.NOTIFY_EMAIL);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
