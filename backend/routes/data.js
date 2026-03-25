/**
 * FLOW:
 *  Public  → GET  /api/data/:key   → frontend reads page content (replaces JSON imports)
 *  Admin   → PUT  /api/data/:key   → admin saves edited content (replaces localStorage)
 *
 * On first GET, if no backend copy exists, data is auto-seeded from src/data/*.json
 * All 11 page data files are supported.
 */
const router      = require("express").Router();
const fs          = require("fs");
const path        = require("path");
const requireAuth = require("../middleware/auth");

const DATA_DIR     = path.join(__dirname, "../data");
const SRC_DIR      = path.join(__dirname, "../seedData");
const FRONTEND_DIR = path.join(__dirname, "../../src/data");

// Ensure backend/data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const ALLOWED_KEYS = [
  "homeData",
  "aboutData",
  "blogsData",
  "blogDetailData",
  "careersData",
  "contactData",
  "courseData",
  "courseDetailsData",
  "coursesData",
  "portfolioData",
  "servicesData",
  "servicesQuoteData",
];

function getFilePath(key) {
  return path.join(DATA_DIR, `${key}.json`);
}

function readData(key) {
  const dest = getFilePath(key);

  // Auto-seed from src/data if backend copy doesn't exist yet
  if (!fs.existsSync(dest)) {
    const src = path.join(SRC_DIR, `${key}.json`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    } else {
      return null;
    }
  }

  try {
    return JSON.parse(fs.readFileSync(dest, "utf8"));
  } catch {
    return null;
  }
}

// ── GET /api/data/:key ───────────────────────────────────────
// Public — used by every page on load to fetch its content
router.get("/:key", (req, res) => {
  const { key } = req.params;

  if (!ALLOWED_KEYS.includes(key))
    return res.status(404).json({ error: `Unknown data key: ${key}` });

  const data = readData(key);
  if (!data)
    return res.status(404).json({ error: `Data not found for key: ${key}` });

  res.json(data);
});

// ── PUT /api/data/:key ───────────────────────────────────────
// Protected — admin saves updated page content
router.put("/:key", requireAuth, (req, res) => {
  const { key } = req.params;

  if (!ALLOWED_KEYS.includes(key))
    return res.status(404).json({ error: `Unknown data key: ${key}` });

  if (!req.body || typeof req.body !== "object")
    return res.status(400).json({ error: "Request body must be a JSON object" });

  const json = JSON.stringify(req.body, null, 2);
  fs.writeFileSync(getFilePath(key), json);

  // Also sync to src/data so postbuild SEO script picks up latest values
  const frontendFile = path.join(FRONTEND_DIR, `${key}.json`);
  if (fs.existsSync(FRONTEND_DIR)) fs.writeFileSync(frontendFile, json);

  res.json({ success: true, key, savedAt: new Date().toISOString() });
});

module.exports = router;
