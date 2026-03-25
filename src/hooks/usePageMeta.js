import { useEffect } from "react";

export default function usePageMeta({ title, description, canonical, ogImage } = {}) {
  useEffect(() => {
    const siteName = "Trivoxa Technologies";
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | IT Training & Cloud Services`;
    const desc = description || "Master in-demand tech skills with Trivoxa Technologies. Industry-led courses in Full Stack, UI/UX, Cloud and more. 98% placement rate.";

    // Title
    document.title = fullTitle;

    // Helper to set meta
    const setMeta = (selector, value) => {
      let el = document.querySelector(selector);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(selector.includes("property") ? "property" : "name",
        selector.match(/["']([^"']+)["']/)?.[1] || "");
      el.setAttribute("content", value);
    };

    setMeta(`meta[name="title"]`, fullTitle);
    setMeta(`meta[name="description"]`, desc);
    setMeta(`meta[property="og:title"]`, fullTitle);
    setMeta(`meta[property="og:description"]`, desc);
    setMeta(`meta[property="twitter:title"]`, fullTitle);
    setMeta(`meta[property="twitter:description"]`, desc);

    if (canonical) {
      let el = document.querySelector("link[rel='canonical']");
      if (!el) { el = document.createElement("link"); el.setAttribute("rel", "canonical"); document.head.appendChild(el); }
      el.setAttribute("href", canonical);
    }

    if (ogImage) {
      setMeta(`meta[property="og:image"]`, ogImage);
      setMeta(`meta[property="twitter:image"]`, ogImage);
    }
  }, [title, description, canonical, ogImage]);
}
