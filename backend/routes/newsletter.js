const router      = require("express").Router();
const requireAuth = require("../middleware/auth");
const NewsletterSubscriber = require("../models/NewsletterSubscriber");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST /api/newsletter ─────────────────────────────────────
router.post("/", async (req, res) => {
  const { email, name = "", phone = "", source = "website" } = req.body;

  if (!email?.trim() || !isValidEmail(email))
    return res.status(400).json({ error: "A valid email address is required" });

  const normalized = email.trim().toLowerCase();
  const existing = await NewsletterSubscriber.findOne({ email: normalized });
  if (existing) return res.json({ success: true, message: "You're already subscribed!" });

  await NewsletterSubscriber.create({ email: normalized, name: name.trim(), phone: phone.trim(), source });
  res.json({ success: true, message: "Successfully subscribed to our newsletter!" });
});

// ── GET /api/newsletter ──────────────────────────────────────
router.get("/", requireAuth, async (_, res) => {
  const list = await NewsletterSubscriber.find().sort({ createdAt: -1 });
  res.json(list.map((d) => ({ ...d.toObject(), id: String(d._id) })));
});

// ── DELETE /api/newsletter/:id ───────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") return res.status(400).json({ error: "Invalid id" });
  await NewsletterSubscriber.findByIdAndDelete(id);
  res.json({ success: true });
});

module.exports = router;
