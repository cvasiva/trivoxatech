const router     = require("express").Router();
const { sendNotification } = require("./contact");
const EnrollSubmission = require("../models/EnrollSubmission");

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

router.post("/", async (req, res) => {
  const { name, email, phone, whatsapp, course = "", message } = req.body;

  const errors = {};
  if (!name?.trim() || name.trim().length < 2)               errors.name     = "Name is required";
  if (!email?.trim() || !isValidEmail(email))                errors.email    = "Valid email is required";
  if (!phone?.trim() || phone.replace(/\D/g, "").length < 10)    errors.phone    = "Valid phone is required";
  if (!whatsapp?.trim() || whatsapp.replace(/\D/g, "").length < 10) errors.whatsapp = "Valid WhatsApp number is required";
  if (!message?.trim() || message.trim().length < 10)        errors.message  = "Message must be at least 10 characters";

  if (Object.keys(errors).length)
    return res.status(400).json({ error: "Validation failed", errors });

  await EnrollSubmission.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    whatsapp: whatsapp.trim(),
    course: course.trim(),
    message: message.trim(),
  });

  res.json({ success: true, message: "Application received! We'll contact you within 24 hours." });

  sendNotification({
    subject: `🎓 New Enrollment Application: ${name.trim()}`,
    text: [`Name:      ${name.trim()}`, `Email:     ${email.trim()}`, `Phone:     ${phone}`, `WhatsApp:  ${whatsapp}`, `Course:    ${course || "—"}`, ``, `Message:`, message.trim()].join("\n"),
    html: `<h2>New Enrollment Application</h2><table style="border-collapse:collapse;width:100%"><tr><td style="padding:8px;border:1px solid #ddd"><b>Name</b></td><td style="padding:8px;border:1px solid #ddd">${name.trim()}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><b>Email</b></td><td style="padding:8px;border:1px solid #ddd">${email.trim()}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><b>Phone</b></td><td style="padding:8px;border:1px solid #ddd">${phone}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><b>WhatsApp</b></td><td style="padding:8px;border:1px solid #ddd">${whatsapp}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><b>Course</b></td><td style="padding:8px;border:1px solid #ddd">${course || "—"}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><b>Message</b></td><td style="padding:8px;border:1px solid #ddd">${message.trim()}</td></tr></table>`,
  }).catch((err) => console.error("[EMAIL] background send failed:", err.message));
});

module.exports = router;
