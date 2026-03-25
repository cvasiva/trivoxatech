import { useEffect } from "react";

export default function usePageMeta({ title, description, keywords, canonical, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription } = {}) {
  useEffect(() => {
    const siteName = "Trivoxa Technologies";
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | IT Training & Cloud Services`;
    const desc = description || "Master in-demand tech skills with Trivoxa Technologies. 98% placement rate.";
    const resolvedOgTitle = ogTitle || fullTitle;
    const resolvedOgDesc = ogDescription || desc;

    // ── Page title ──────────────────────────────────────────
    document.title = fullTitle;

    // ── Helper: set <meta name="..."> ───────────────────────
    const setName = (name, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    // ── Helper: set <meta property="..."> ──────────────────
    const setProp = (property, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    // ── Standard meta ───────────────────────────────────────
    setName("title", fullTitle);
    setName("description", desc);
    if (keywords) setName("keywords", keywords);

    // ── Open Graph ──────────────────────────────────────────
    setProp("og:title", resolvedOgTitle);
    setProp("og:description", resolvedOgDesc);
    if (ogImage) setProp("og:image", ogImage);
    if (canonical) setProp("og:url", canonical);

    // ── Twitter ─────────────────────────────────────────────
    setName("twitter:title", twitterTitle || resolvedOgTitle);
    setName("twitter:description", twitterDescription || resolvedOgDesc);
    if (ogImage) setName("twitter:image", ogImage);

    // ── Canonical ───────────────────────────────────────────
    if (canonical) {
      let el = document.querySelector("link[rel='canonical']");
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
      }
      el.setAttribute("href", canonical);
    }
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription]);
}
