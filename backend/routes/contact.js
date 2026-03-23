/**
 * FLOW:
 *  User fills Contact page form → POST /api/contact
 *  → Validates fields
 *  → Saves to contactSubmissions.json
 *  → Sends email notification to admin (if SMTP configured)
 *  → Returns { success: true }
 */
const router     = require("express").Router();
const fs         = require("fs");
const path       = require("path");
const nodemailer = require("nodemailer");

const FILE = path.join(__dirname, "../data/contactSubmissions.json");

function load() {
  if (!fs.existsSync(FILE)) return [];
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; }
}

function append(entry) {
  const all = load();
  all.unshift(entry);
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST /api/contact ────────────────────────────────────────
// Body: { name, email, phone?, interest?, message }
router.post("/", async (req, res) => {
  const { name, email, phone = "", interest = "", message } = req.body;

  // Validation
  const errors = {};
  if (!name?.trim())    errors.name    = "Name is required";
  if (!email?.trim())   errors.email   = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email address";
  if (!message?.trim()) errors.message = "Message is required";
  else if (message.trim().length < 10) errors.message = "Message must be at least 10 characters";

  if (Object.keys(errors).length)
    return res.status(400).json({ error: "Validation failed", errors });

  const entry = {
    id:        Date.now(),
    type:      "contact",
    name:      name.trim(),
    email:     email.trim().toLowerCase(),
    phone:     phone.trim(),
    interest,
    message:   message.trim(),
    read:      false,
    createdAt: new Date().toISOString(),
  };

  append(entry);

  // Optional email notification
  await sendNotification({
    subject: `📩 New Contact: ${entry.name}`,
    text: [
      `Name:     ${entry.name}`,
      `Email:    ${entry.email}`,
      `Phone:    ${entry.phone || "—"}`,
      `Interest: ${entry.interest || "—"}`,
      ``,
      entry.message,
    ].join("\n"),
  });

  res.json({ success: true, message: "Your message has been received. We'll be in touch within 24 hours." });
});

// ── Shared email helper ──────────────────────────────────────
async function sendNotification({ subject, text }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"Trivoxa Website" <${process.env.SMTP_USER}>`,
      to:   process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
      subject,
      text,
    });
  } catch (err) {
    console.error("[EMAIL] Failed to send notification:", err.message);
  }
}

module.exports = router;
module.exports.sendNotification = sendNotification;
