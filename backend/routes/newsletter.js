const router      = require("express").Router();
const requireAuth = require("../middleware/auth");
const NewsletterSubscriber = require("../models/NewsletterSubscriber");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST /api/newsletter ─────────────────────────────────────
router.post("/", async (req, res) => {
  const { email, source = "website" } = req.body;

  if (!email?.trim() || !isValidEmail(email))
    return res.status(400).json({ error: "A valid email address is required" });

  const normalized = email.trim().toLowerCase();
  const existing = await NewsletterSubscriber.findOne({ email: normalized });
  if (existing) return res.json({ success: true, message: "You're already subscribed!" });

  await NewsletterSubscriber.create({ email: normalized, source });
  res.json({ success: true, message: "Successfully subscribed to our newsletter!" });
});

// ── GET /api/newsletter ──────────────────────────────────────
router.get("/", requireAuth, async (_, res) => {
  const list = await NewsletterSubscriber.find().sort({ createdAt: -1 });
  res.json(list);
});

// ── DELETE /api/newsletter/:id ───────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  await NewsletterSubscriber.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
