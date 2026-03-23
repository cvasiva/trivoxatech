/**
 * FLOW:
 *  Admin opens /admin/submissions → GET /api/submissions
 *  → Lists all contact form + quote request submissions
 *  → Admin clicks a message → PATCH /api/submissions/:id/read
 *  → Admin deletes a message → DELETE /api/submissions/:id
 *
 *  Query params for GET:
 *    ?type=contact|quote   filter by type
 *    ?unread=true          show only unread
 */
const router      = require("express").Router();
const fs          = require("fs");
const path        = require("path");
const requireAuth = require("../middleware/auth");

const FILE = path.join(__dirname, "../data/contactSubmissions.json");

function load() {
  if (!fs.existsSync(FILE)) return [];
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ── GET /api/submissions ─────────────────────────────────────
router.get("/", requireAuth, (req, res) => {
  let all = load();

  if (req.query.type)
    all = all.filter((s) => s.type === req.query.type);

  if (req.query.unread === "true")
    all = all.filter((s) => !s.read);

  const unreadCount = load().filter((s) => !s.read).length;

  res.json({ total: all.length, unread: unreadCount, submissions: all });
});

// ── GET /api/submissions/stats ───────────────────────────────
router.get("/stats", requireAuth, (_, res) => {
  const all = load();
  res.json({
    total:        all.length,
    unread:       all.filter((s) => !s.read).length,
    contacts:     all.filter((s) => s.type === "contact").length,
    quotes:       all.filter((s) => s.type === "quote").length,
    todayCount:   all.filter((s) => s.createdAt?.startsWith(new Date().toISOString().slice(0, 10))).length,
  });
});

// ── PATCH /api/submissions/:id/read ─────────────────────────
router.patch("/:id/read", requireAuth, (req, res) => {
  const all = load().map((s) =>
    s.id === Number(req.params.id) ? { ...s, read: true, readAt: new Date().toISOString() } : s
  );
  save(all);
  res.json({ success: true });
});

// ── DELETE /api/submissions/:id ──────────────────────────────
router.delete("/:id", requireAuth, (req, res) => {
  const before = load();
  const after  = before.filter((s) => s.id !== Number(req.params.id));

  if (before.length === after.length)
    return res.status(404).json({ error: "Submission not found" });

  save(after);
  res.json({ success: true });
});

module.exports = router;
