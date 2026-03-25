require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "https://trivoxatechnologis.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());
app.use(requestLogger);

// ── MongoDB Connection ───────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅  MongoDB connected"))
  .catch((err) => console.error("❌  MongoDB connection failed:", err.message));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth",        require("./routes/auth"));
app.use("/api/data",        require("./routes/data"));
app.use("/api/contact",     require("./routes/contact"));
app.use("/api/quote",       require("./routes/quote"));
app.use("/api/newsletter",  require("./routes/newsletter"));
app.use("/api/submissions", require("./routes/submissions"));
app.use("/api/seo",         require("./routes/seo"));
app.use("/api/enroll",      require("./routes/enroll"));

// ── Health ───────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// ── 404 ──────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }));

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅  Backend running → http://localhost:${PORT}`));

function requestLogger(req, _res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
}
