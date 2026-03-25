/**
 * PUT /api/seo/index-html
 * Rewrites the SEO meta tags in public/index.html with values from the CMS.
 */
const router      = require("express").Router();
const fs          = require("fs");
const path        = require("path");
const requireAuth = require("../middleware/auth");

// Resolve public/index.html relative to the project root (one level up from backend/)
const INDEX_PATH = path.join(__dirname, "../../public/index.html");

function setMeta(html, attr, attrVal, contentVal) {
  // Replace content="..." on the matching meta tag
  const escaped = attrVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(<meta\\s[^>]*${attr}=["']${escaped}["'][^>]*content=["'])[^"']*`, "i");
  const re2 = new RegExp(`(<meta\\s[^>]*content=["'])[^"']*(?=["'][^>]*${attr}=["']${escaped}["'])`, "i");
  if (re.test(html))  return html.replace(re,  `$1${contentVal}`);
  if (re2.test(html)) return html.replace(re2, `$1${contentVal}`);
  return html;
}

function setLinkHref(html, rel, hrefVal) {
  const escaped = rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(<link\\s[^>]*rel=["']${escaped}["'][^>]*href=["'])[^"']*`, "i");
  return re.test(html) ? html.replace(re, `$1${hrefVal}`) : html;
}

router.put("/index-html", requireAuth, (req, res) => {
  const { title, description, keywords, canonical, ogTitle, ogDescription, ogImage } = req.body || {};

  if (!fs.existsSync(INDEX_PATH))
    return res.status(404).json({ error: "index.html not found" });

  let html = fs.readFileSync(INDEX_PATH, "utf8");

  if (title) {
    // <title> tag
    html = html.replace(/(<title>)[^<]*(<\/title>)/, `$1${title}$2`);
    // <meta name="title" ...>
    html = setMeta(html, "name", "title", title);
  }
  if (description)   html = setMeta(html, "name",     "description",    description);
  if (keywords)      html = setMeta(html, "name",     "keywords",        keywords);
  if (ogTitle) {
    html = setMeta(html, "property", "og:title",       ogTitle);
    html = setMeta(html, "name",     "twitter:title",  ogTitle);
  }
  if (ogDescription) {
    html = setMeta(html, "property", "og:description",       ogDescription);
    html = setMeta(html, "name",     "twitter:description",  ogDescription);
  }
  if (ogImage) {
    html = setMeta(html, "property", "og:image",      ogImage);
    html = setMeta(html, "name",     "twitter:image", ogImage);
  }
  if (canonical) {
    html = setLinkHref(html, "canonical", canonical);
    html = setMeta(html, "property", "og:url",         canonical);
    html = setMeta(html, "name",     "twitter:url",    canonical);
  }

  fs.writeFileSync(INDEX_PATH, html, "utf8");
  res.json({ success: true });
});

module.exports = router;
