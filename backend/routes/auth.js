/**
 * FLOW:
 *  First-time setup → POST /api/auth/register       (open when 0 admins, else JWT required)
 *  Username login   → POST /api/auth/login           → returns JWT
 *  Google login     → POST /api/auth/google          → verifies Google ID token → returns JWT
 *  Session check    → GET  /api/auth/verify          → validates JWT
 *  List admins      → GET  /api/auth/admins          → protected
 *  Delete admin     → DELETE /api/auth/admins/:id    → protected
 */
const router      = require("express").Router();
const bcrypt      = require("bcryptjs");
const jwt         = require("jsonwebtoken");
const fs          = require("fs");
const path        = require("path");
const { OAuth2Client } = require("google-auth-library");
const requireAuth = require("../middleware/auth");

const ADMINS_FILE  = path.join(__dirname, "../data/admins.json");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Helpers ──────────────────────────────────────────────────
function loadAdmins() {
  if (!fs.existsSync(ADMINS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(ADMINS_FILE, "utf8")); } catch { return []; }
}

function saveAdmins(admins) {
  const dir = path.dirname(ADMINS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2));
}

function signToken(admin) {
  return jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Seed default admin from .env on first startup
(async () => {
  if (!fs.existsSync(ADMINS_FILE)) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "trivoxa@2024", 10);
    saveAdmins([{
      id:        1,
      username:  process.env.ADMIN_USERNAME || "admin",
      email:     process.env.ADMIN_EMAIL    || "admin@trivoxatech.com",
      role:      "superadmin",
      provider:  "local",
      hash,
      createdAt: new Date().toISOString(),
    }]);
    console.log("✅  Default admin seeded from .env");
  }
})();

// ── POST /api/auth/google ────────────────────────────────────
// Body: { credential }  — the Google ID token from the frontend
// Flow:
//   1. Verify the Google ID token with Google's servers
//   2. Extract email + name + picture from the payload
//   3. If email matches an existing admin → issue JWT (login)
//   4. If no admins exist yet → auto-create first superadmin (first-time setup)
//   5. Otherwise → reject (only pre-existing admins can use Google login)
router.post("/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential)
    return res.status(400).json({ error: "Google credential token is required" });

  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === "your_google_client_id_here")
    return res.status(503).json({ error: "Google OAuth is not configured on this server" });

  // Verify with Google
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken:  credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: "Invalid Google token" });
  }

  const { email, name, picture, sub: googleId } = payload;
  const admins = loadAdmins();

  // Case 1: existing admin with this email → log in
  let admin = admins.find((a) => a.email === email.toLowerCase());
  if (admin) {
    // Update Google info if not already stored
    if (!admin.googleId) {
      admin.googleId = googleId;
      admin.picture  = picture;
      saveAdmins(admins);
    }
    return res.json({
      token:  signToken(admin),
      expiresIn: "8h",
      admin:  { id: admin.id, username: admin.username, email: admin.email, role: admin.role, picture: admin.picture },
    });
  }

  // Case 2: no admins at all → first-time setup, auto-create superadmin
  if (admins.length === 0) {
    const newAdmin = {
      id:        Date.now(),
      username:  name?.replace(/\s+/g, "").toLowerCase() || email.split("@")[0],
      email:     email.toLowerCase(),
      role:      "superadmin",
      provider:  "google",
      googleId,
      picture,
      hash:      null,
      createdAt: new Date().toISOString(),
    };
    saveAdmins([newAdmin]);
    console.log(`✅  First admin created via Google: ${newAdmin.email}`);
    return res.status(201).json({
      token:  signToken(newAdmin),
      expiresIn: "8h",
      admin:  { id: newAdmin.id, username: newAdmin.username, email: newAdmin.email, role: newAdmin.role, picture: newAdmin.picture },
    });
  }

  // Case 3: admins exist but this Google account is not registered
  return res.status(403).json({
    error: "This Google account is not authorized. Ask an existing admin to add your email first.",
  });
});

// ── POST /api/auth/register ──────────────────────────────────
// Open only when NO admins exist, OR protected by JWT
router.post("/register", async (req, res) => {
  const admins = loadAdmins();

  if (admins.length > 0) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      return res.status(401).json({ error: "Only existing admins can create new accounts" });
    try { jwt.verify(header.split(" ")[1], process.env.JWT_SECRET); }
    catch { return res.status(401).json({ error: "Invalid or expired token" }); }
  }

  const { username, email, password, confirmPassword } = req.body;
  const errors = {};
  if (!username?.trim() || username.trim().length < 3)
    errors.username = "Username must be at least 3 characters";
  if (!email?.trim() || !isValidEmail(email))
    errors.email = "A valid email address is required";
  if (!password || password.length < 6)
    errors.password = "Password must be at least 6 characters";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  if (Object.keys(errors).length)
    return res.status(400).json({ error: "Validation failed", errors });

  if (admins.find((a) => a.username === username.trim()))
    return res.status(409).json({ error: "Username already taken" });
  if (admins.find((a) => a.email === email.trim().toLowerCase()))
    return res.status(409).json({ error: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);
  const newAdmin = {
    id:        Date.now(),
    username:  username.trim(),
    email:     email.trim().toLowerCase(),
    role:      admins.length === 0 ? "superadmin" : "admin",
    provider:  "local",
    hash,
    createdAt: new Date().toISOString(),
  };

  admins.push(newAdmin);
  saveAdmins(admins);

  res.status(201).json({
    token: signToken(newAdmin),
    admin: { id: newAdmin.id, username: newAdmin.username, email: newAdmin.email, role: newAdmin.role },
  });
});

// ── POST /api/auth/login ─────────────────────────────────────
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password)
    return res.status(400).json({ error: "Username and password are required" });

  const admin = loadAdmins().find((a) => a.username === username.trim());
  if (!admin || !admin.hash)
    return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, admin.hash);
  if (!valid)
    return res.status(401).json({ error: "Invalid credentials" });

  res.json({
    token:     signToken(admin),
    expiresIn: "8h",
    admin:     { id: admin.id, username: admin.username, email: admin.email, role: admin.role, picture: admin.picture },
  });
});

// ── GET /api/auth/verify ─────────────────────────────────────
router.get("/verify", requireAuth, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// ── GET /api/auth/admins ─────────────────────────────────────
router.get("/admins", requireAuth, (_, res) => {
  const list = loadAdmins().map(({ hash, ...rest }) => rest);
  res.json(list);
});

// ── DELETE /api/auth/admins/:id ──────────────────────────────
router.delete("/admins/:id", requireAuth, (req, res) => {
  const admins = loadAdmins();
  const target = admins.find((a) => a.id === Number(req.params.id));
  if (!target) return res.status(404).json({ error: "Admin not found" });
  if (String(target.id) === String(req.admin.id))
    return res.status(400).json({ error: "You cannot delete your own account" });

  saveAdmins(admins.filter((a) => a.id !== Number(req.params.id)));
  res.json({ success: true });
});

module.exports = router;
