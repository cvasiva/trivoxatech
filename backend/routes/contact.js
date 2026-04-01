const router     = require("express").Router();
const nodemailer = require("nodemailer");
const ContactSubmission = require("../models/ContactSubmission");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST /api/contact ────────────────────────────────────────
router.post("/", async (req, res) => {
  const { name, email, phone = "", interest = "", message } = req.body;

  const errors = {};
  if (!name?.trim())    errors.name    = "Name is required";
  if (!email?.trim())   errors.email   = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email address";
  if (!message?.trim()) errors.message = "Message is required";
  else if (message.trim().length < 10) errors.message = "Message must be at least 10 characters";

  if (Object.keys(errors).length)
    return res.status(400).json({ error: "Validation failed", errors });

  await ContactSubmission.create({
    type: "contact",
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    interest,
    message: message.trim(),
  });

  await sendNotification({
    subject: `📩 New Contact: ${name.trim()}`,
    text: [`Name:     ${name.trim()}`, `Email:    ${email.trim()}`, `Phone:    ${phone || "—"}`, `Interest: ${interest || "—"}`, ``, message.trim()].join("\n"),
    html: `<h2>New Contact Message</h2><table style="border-collapse:collapse;width:100%"><tr><td style="padding:8px;border:1px solid #ddd"><b>Name</b></td><td style="padding:8px;border:1px solid #ddd">${name.trim()}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><b>Email</b></td><td style="padding:8px;border:1px solid #ddd">${email.trim()}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><b>Phone</b></td><td style="padding:8px;border:1px solid #ddd">${phone || "—"}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><b>Interest</b></td><td style="padding:8px;border:1px solid #ddd">${interest || "—"}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><b>Message</b></td><td style="padding:8px;border:1px solid #ddd">${message.trim()}</td></tr></table>`,
  });

  res.json({ success: true, message: "Your message has been received. We'll be in touch within 24 hours." });
});

// ── Shared email helper ──────────────────────────────────────
async function sendNotification({ subject, text, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[EMAIL] Skipped — SMTP_USER or SMTP_PASS not set in .env");
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });
    await transporter.sendMail({
      from: `"Trivoxa Website" <${process.env.SMTP_USER}>`,
      to:   process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
      subject,
      text,
      ...(html ? { html } : {}),
    });
    console.log("[EMAIL] ✅ Sent to", process.env.NOTIFY_EMAIL);
  } catch (err) {
    console.error("[EMAIL] ❌ Failed:", err.message);
  }
}

module.exports = router;
module.exports.sendNotification = sendNotification;
