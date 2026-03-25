const router      = require("express").Router();
const bcrypt      = require("bcryptjs");
const jwt         = require("jsonwebtoken");
const mongoose    = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const requireAuth = require("../middleware/auth");
const Admin       = require("../models/Admin");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, username: admin.username, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safeAdmin(a) {
  return { id: a._id, username: a.username, email: a.email, role: a.role, picture: a.picture };
}

// Seed default admin — runs after MongoDB connects
mongoose.connection.once("open", async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "trivoxa@2024", 10);
      await Admin.create({
        username: process.env.ADMIN_USERNAME || "admin",
        email:    process.env.ADMIN_EMAIL    || "admin@trivoxatech.com",
        role:     "superadmin",
        provider: "local",
        hash,
      });
      console.log("✅  Default admin seeded from .env");
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
});

// ── POST /api/auth/google ────────────────────────────────────
router.post("/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential)
    return res.status(400).json({ error: "Google credential token is required" });

  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === "your_google_client_id_here")
    return res.status(503).json({ error: "Google OAuth is not configured on this server" });

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: "Invalid Google token" });
  }

  const { email, name, picture, sub: googleId } = payload;

  let admin = await Admin.findOne({ email: email.toLowerCase() });
  if (admin) {
    if (!admin.googleId) { admin.googleId = googleId; admin.picture = picture; await admin.save(); }
    return res.json({ token: signToken(admin), expiresIn: "8h", admin: safeAdmin(admin) });
  }

  const count = await Admin.countDocuments();
  if (count === 0) {
    admin = await Admin.create({
      username: name?.replace(/\s+/g, "").toLowerCase() || email.split("@")[0],
      email:    email.toLowerCase(),
      role:     "superadmin",
      provider: "google",
      googleId,
      picture,
    });
    console.log(`✅  First admin created via Google: ${admin.email}`);
    return res.status(201).json({ token: signToken(admin), expiresIn: "8h", admin: safeAdmin(admin) });
  }

  return res.status(403).json({ error: "This Google account is not authorized. Ask an existing admin to add your email first." });
});

// ── POST /api/auth/register ──────────────────────────────────
router.post("/register", async (req, res) => {
  const count = await Admin.countDocuments();

  if (count > 0) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      return res.status(401).json({ error: "Only existing admins can create new accounts" });
    try { jwt.verify(header.split(" ")[1], process.env.JWT_SECRET); }
    catch { return res.status(401).json({ error: "Invalid or expired token" }); }
  }

  const { username, email, password, confirmPassword } = req.body;
  const errors = {};
  if (!username?.trim() || username.trim().length < 3) errors.username = "Username must be at least 3 characters";
  if (!email?.trim() || !isValidEmail(email))          errors.email    = "A valid email address is required";
  if (!password || password.length < 6)                errors.password = "Password must be at least 6 characters";
  if (password !== confirmPassword)                    errors.confirmPassword = "Passwords do not match";
  if (Object.keys(errors).length) return res.status(400).json({ error: "Validation failed", errors });

  if (await Admin.findOne({ username: username.trim() }))
    return res.status(409).json({ error: "Username already taken" });
  if (await Admin.findOne({ email: email.trim().toLowerCase() }))
    return res.status(409).json({ error: "Email already registered" });

  const hash  = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    username: username.trim(),
    email:    email.trim().toLowerCase(),
    role:     count === 0 ? "superadmin" : "admin",
    provider: "local",
    hash,
  });

  res.status(201).json({ token: signToken(admin), admin: safeAdmin(admin) });
});

// ── POST /api/auth/login ─────────────────────────────────────
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password)
    return res.status(400).json({ error: "Username and password are required" });

  const admin = await Admin.findOne({ username: username.trim() });
  if (!admin || !admin.hash)
    return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, admin.hash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ token: signToken(admin), expiresIn: "8h", admin: safeAdmin(admin) });
});

// ── GET /api/auth/verify ─────────────────────────────────────
router.get("/verify", requireAuth, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// ── GET /api/auth/admins ─────────────────────────────────────
router.get("/admins", requireAuth, async (_, res) => {
  const list = await Admin.find({}, "-hash");
  res.json(list);
});

// ── DELETE /api/auth/admins/:id ──────────────────────────────
router.delete("/admins/:id", requireAuth, async (req, res) => {
  if (String(req.params.id) === String(req.admin.id))
    return res.status(400).json({ error: "You cannot delete your own account" });

  const result = await Admin.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: "Admin not found" });
  res.json({ success: true });
});

module.exports = router;
