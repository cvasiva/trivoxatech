/**
 * FLOW:
 *  User fills ServicesQuote page form → POST /api/quote
 *  → Validates fields
 *  → Saves to contactSubmissions.json (type: "quote")
 *  → Sends email notification to admin
 *  → Returns { success: true }
 */
const router = require("express").Router();
const fs     = require("fs");
const path   = require("path");
const { sendNotification } = require("./contact");

const FILE = path.join(__dirname, "../data/contactSubmissions.json");

function load() {
  if (!fs.existsSync(FILE)) return [];
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; }
}

// ── POST /api/quote ──────────────────────────────────────────
// Body: { name, email, service, budget, timeline, message? }
router.post("/", async (req, res) => {
  const { name, email, service = "", budget = "", timeline = "", message = "" } = req.body;

  if (!name?.trim() || !email?.trim())
    return res.status(400).json({ error: "Name and email are required" });

  const entry = {
    id:        Date.now(),
    type:      "quote",
    name:      name.trim(),
    email:     email.trim().toLowerCase(),
    service,
    budget,
    timeline,
    message:   message.trim(),
    read:      false,
    createdAt: new Date().toISOString(),
  };

  const all = load();
  all.unshift(entry);
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2));

  await sendNotification({
    subject: `💼 New Quote Request: ${entry.name}`,
    text: [
      `Name:     ${entry.name}`,
      `Email:    ${entry.email}`,
      `Service:  ${entry.service || "—"}`,
      `Budget:   ${entry.budget || "—"}`,
      `Timeline: ${entry.timeline || "—"}`,
      ``,
      entry.message || "(no message)",
    ].join("\n"),
  });

  res.json({ success: true, message: "Quote request received. We'll respond within 24 hours." });
});

module.exports = router;
