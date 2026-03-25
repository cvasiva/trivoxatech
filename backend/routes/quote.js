const router = require("express").Router();
const { sendNotification } = require("./contact");
const ContactSubmission = require("../models/ContactSubmission");

// ── POST /api/quote ──────────────────────────────────────────
router.post("/", async (req, res) => {
  const { name, email, service = "", budget = "", timeline = "", message = "" } = req.body;

  if (!name?.trim() || !email?.trim())
    return res.status(400).json({ error: "Name and email are required" });

  await ContactSubmission.create({
    type: "quote",
    name: name.trim(),
    email: email.trim().toLowerCase(),
    service,
    budget,
    timeline,
    message: message.trim(),
  });

  await sendNotification({
    subject: `💼 New Quote Request: ${name.trim()}`,
    text: [`Name:     ${name.trim()}`, `Email:    ${email.trim()}`, `Service:  ${service || "—"}`, `Budget:   ${budget || "—"}`, `Timeline: ${timeline || "—"}`, ``, message || "(no message)"].join("\n"),
  });

  res.json({ success: true, message: "Quote request received. We'll respond within 24 hours." });
});

module.exports = router;
