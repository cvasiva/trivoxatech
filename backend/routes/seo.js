/**
 * PUT /api/seo/index-html
 * Updates SEO meta tags in public/index.html using data-seo markers.
 */
const router      = require("express").Router();
const fs          = require("fs");
const path        = require("path");
const requireAuth = require("../middleware/auth");

const INDEX_PATH = path.join(__dirname, "../../public/index.html");

/**
 * Replaces content="..." on all tags with data-seo="key"
 * Also handles href="..." for <link> tags
 */
function updateSeoTag(html, key, value) {
  // Escape value for use inside attribute
  const safe = value.replace(/"/g, "&quot;");

  // Replace content="..." on tags with data-seo="key"
  html = html.replace(
    new RegExp(`(<(?:meta|link)[^>]*data-seo="${key}"[^>]*(?:content|href)=")[^"]*(")`,"g"),
    `$1${safe}$2`
  );
  // Also handle when content/href comes before data-seo
  html = html.replace(
    new RegExp(`(<(?:meta|link)[^>]*(?:content|href)=")[^"]*("[^>]*data-seo="${key}")`,"g"),
    `$1${safe}$2`
  );
  return html;
}

router.put("/index-html", requireAuth, (req, res) => {
  const { title, description, keywords, canonical, ogTitle, ogDescription, ogImage } = req.body || {};

  if (!fs.existsSync(INDEX_PATH))
    return res.status(404).json({ error: "index.html not found" });

  let html = fs.readFileSync(INDEX_PATH, "utf8");

  if (title) {
    // Update <title> tag text
    html = html.replace(/(<title[^>]*>)[^<]*(<\/title>)/, `$1${title}$2`);
    html = updateSeoTag(html, "title", title);
  }
  if (description)   html = updateSeoTag(html, "description",   description);
  if (keywords)      html = updateSeoTag(html, "keywords",      keywords);
  if (ogTitle)       html = updateSeoTag(html, "ogTitle",       ogTitle);
  if (ogDescription) html = updateSeoTag(html, "ogDescription", ogDescription);
  if (ogImage)       html = updateSeoTag(html, "ogImage",       ogImage);
  if (canonical)     html = updateSeoTag(html, "canonical",     canonical);

  fs.writeFileSync(INDEX_PATH, html, "utf8");
  res.json({ success: true });
});

module.exports = router;
