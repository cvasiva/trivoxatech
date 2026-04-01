require("dotenv").config();
const express       = require("express");
const cors          = require("cors");
const helmet        = require("helmet");
const mongoose      = require("mongoose");
const rateLimit     = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

// ── Security Headers (helmet) ────────────────────────────────
app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.xssFilter());

// ── CORS ─────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "https://trivoxatechnologis.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Body Parser ───────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // block oversized payloads

// ── NoSQL Injection Prevention ────────────────────────────────
app.use(mongoSanitize());

// ── Rate Limiters ─────────────────────────────────────────────
// Global — 100 req / 15 min per IP
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
}));

// Auth — 10 attempts / 15 min (brute force protection)
app.use("/api/auth/login", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
}));

// Public forms — 20 submissions / hour per IP
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Too many submissions. Please try again later." },
});
app.use("/api/contact",    formLimiter);
app.use("/api/quote",      formLimiter);
app.use("/api/enroll",     formLimiter);
app.use("/api/newsletter", formLimiter);

// ── Request Logger ────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── MongoDB Connection ────────────────────────────────────────
function connectDB() {
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS:         30000,
    socketTimeoutMS:          45000,
    maxPoolSize:              10,
  })
    .then(() => console.log("✅  MongoDB connected"))
    .catch((err) => {
      console.error("❌  MongoDB connection failed:", err.message);
      setTimeout(connectDB, 5000);
    });
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected — reconnecting...");
  setTimeout(connectDB, 5000);
});

connectDB();

// ── DB ready guard ────────────────────────────────────────────
app.use("/api/auth", (req, res, next) => {
  if (mongoose.connection.readyState !== 1)
    return res.status(503).json({ error: "Database unavailable. Please try again shortly." });
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",        require("./routes/auth"));
app.use("/api/data",        require("./routes/data"));
app.use("/api/contact",     require("./routes/contact"));
app.use("/api/quote",       require("./routes/quote"));
app.use("/api/newsletter",  require("./routes/newsletter"));
app.use("/api/submissions", require("./routes/submissions"));
app.use("/api/seo",         require("./routes/seo"));
app.use("/api/enroll",      require("./routes/enroll"));
app.use("/api/visitors",    require("./routes/visitors"));
app.use("/api/export",      require("./routes/export"));

// ── Health ────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  // Never expose stack traces in production
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅  Backend running → http://localhost:${PORT}`));
