const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "../build");
const DATA_DIR  = path.join(__dirname, "../src/data");

// Map route → data file key
const ROUTES = {
  "/about":        "aboutData",
  "/courses":      "coursesData",
  "/services":     "servicesData",
  "/contact":      "contactData",
  "/blogs":        "blogsData",
  "/portfolio":    "portfolioData",
  "/careers":      "careersData",
  "/servicesquote":"servicesQuoteData",
  "/coursedetails":"courseDetailsData",
};

function readSeo(key) {
  const file = path.join(DATA_DIR, `${key}.json`);
  if (!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file, "utf8")).seo || null; } catch { return null; }
}

function esc(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function injectMeta(html, seo) {
  const title         = seo.title         || "";
  const description   = seo.description   || "";
  const keywords      = seo.keywords      || "";
  const ogTitle       = seo.ogTitle       || title;
  const ogDescription = seo.ogDescription || description;
  const ogImage       = seo.ogImage       || "";
  const canonical     = seo.canonical     || "";

  html = html.replace(/(<title[^>]*>)[^<]*(<\/title>)/, `$1${esc(title)}$2`);

  const pairs = [
    [/(<meta\s[^>]*name="title"[^>]*content=")[^"]*(")/i,               esc(title)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="title")/i,               esc(title)],
    [/(<meta\s[^>]*name="description"[^>]*content=")[^"]*(")/i,         esc(description)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="description")/i,         esc(description)],
    [/(<meta\s[^>]*name="keywords"[^>]*content=")[^"]*(")/i,            esc(keywords)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="keywords")/i,            esc(keywords)],
    [/(<meta\s[^>]*property="og:title"[^>]*content=")[^"]*(")/i,        esc(ogTitle)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*property="og:title")/i,        esc(ogTitle)],
    [/(<meta\s[^>]*property="og:description"[^>]*content=")[^"]*(")/i,  esc(ogDescription)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*property="og:description")/i,  esc(ogDescription)],
    [/(<meta\s[^>]*property="og:image"[^>]*content=")[^"]*(")/i,        esc(ogImage)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*property="og:image")/i,        esc(ogImage)],
    [/(<meta\s[^>]*property="og:url"[^>]*content=")[^"]*(")/i,          esc(canonical)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*property="og:url")/i,          esc(canonical)],
    [/(<meta\s[^>]*name="twitter:title"[^>]*content=")[^"]*(")/i,       esc(ogTitle)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:title")/i,       esc(ogTitle)],
    [/(<meta\s[^>]*name="twitter:description"[^>]*content=")[^"]*(")/i, esc(ogDescription)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:description")/i, esc(ogDescription)],
    [/(<meta\s[^>]*name="twitter:image"[^>]*content=")[^"]*(")/i,       esc(ogImage)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:image")/i,       esc(ogImage)],
    [/(<meta\s[^>]*name="twitter:url"[^>]*content=")[^"]*(")/i,         esc(canonical)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:url")/i,         esc(canonical)],
    [/(<link\s[^>]*rel="canonical"[^>]*href=")[^"]*(")/i,               esc(canonical)],
    [/(<link\s[^>]*href=")[^"]*("[^>]*rel="canonical")/i,               esc(canonical)],
  ];

  for (const [re, val] of pairs) {
    html = html.replace(re, `$1${val}$2`);
  }
  return html;
}

const baseHtml = fs.readFileSync(path.join(BUILD_DIR, "index.html"), "utf8");

for (const [route, key] of Object.entries(ROUTES)) {
  const seo = readSeo(key);
  if (!seo) { console.log(`⚠️  No seo block found for ${key}, skipping ${route}`); continue; }

  const dir = path.join(BUILD_DIR, route);
  fs.mkdirSync(dir, { recursive: true });
  const html = injectMeta(baseHtml, seo);
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
  console.log(`✅  ${route}/index.html → "${seo.title}"`);
}

console.log("✅  SEO postbuild complete.");
