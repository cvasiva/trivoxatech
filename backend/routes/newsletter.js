/**
 * FLOW:
 *  User enters email in Blog sidebar or Careers newsletter → POST /api/newsletter
 *  → Validates email
 *  → Saves to newsletterSubscribers.json (deduplicates)
 *  → Returns { success: true }
 *
 *  Admin → GET /api/newsletter (protected) → list all subscribers
 */
const router      = require("express").Router();
const fs          = require("fs");
const path        = require("path");
const requireAuth = require("../middleware/auth");

const FILE = path.join(__dirname, "../data/newsletterSubscribers.json");

function load() {
  if (!fs.existsSync(FILE)) return [];
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST /api/newsletter ─────────────────────────────────────
router.post("/", (req, res) => {
  const { email, source = "website" } = req.body;

  if (!email?.trim() || !isValidEmail(email))
    return res.status(400).json({ error: "A valid email address is required" });

  const all = load();
  const normalized = email.trim().toLowerCase();

  if (all.find((s) => s.email === normalized))
    return res.json({ success: true, message: "You're already subscribed!" });

  all.unshift({ id: Date.now(), email: normalized, source, subscribedAt: new Date().toISOString() });
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2));

  res.json({ success: true, message: "Successfully subscribed to our newsletter!" });
});

// ── GET /api/newsletter ──────────────────────────────────────
// Protected — admin views all subscribers
router.get("/", requireAuth, (_, res) => {
  res.json(load());
});

// ── DELETE /api/newsletter/:id ───────────────────────────────
// Protected — admin removes a subscriber
router.delete("/:id", requireAuth, (req, res) => {
  const all = load().filter((s) => s.id !== Number(req.params.id));
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2));
  res.json({ success: true });
});

module.exports = router;
