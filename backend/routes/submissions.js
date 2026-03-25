const router      = require("express").Router();
const requireAuth = require("../middleware/auth");
const ContactSubmission = require("../models/ContactSubmission");

// ── GET /api/submissions ─────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  const filter = {};
  if (req.query.type)          filter.type = req.query.type;
  if (req.query.unread === "true") filter.read = false;

  const [submissions, unread] = await Promise.all([
    ContactSubmission.find(filter).sort({ createdAt: -1 }),
    ContactSubmission.countDocuments({ read: false }),
  ]);

  res.json({ total: submissions.length, unread, submissions });
});

// ── GET /api/submissions/stats ───────────────────────────────
router.get("/stats", requireAuth, async (_, res) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [total, unread, contacts, quotes, todayCount] = await Promise.all([
    ContactSubmission.countDocuments(),
    ContactSubmission.countDocuments({ read: false }),
    ContactSubmission.countDocuments({ type: "contact" }),
    ContactSubmission.countDocuments({ type: "quote" }),
    ContactSubmission.countDocuments({ createdAt: { $gte: today } }),
  ]);
  res.json({ total, unread, contacts, quotes, todayCount });
});

// ── PATCH /api/submissions/:id/read ─────────────────────────
router.patch("/:id/read", requireAuth, async (req, res) => {
  await ContactSubmission.findByIdAndUpdate(req.params.id, { read: true, readAt: new Date() });
  res.json({ success: true });
});

// ── DELETE /api/submissions/:id ──────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  const result = await ContactSubmission.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: "Submission not found" });
  res.json({ success: true });
});

module.exports = router;
