import { useEffect } from "react";

const DEFAULT = {
  title: "Trivoxa Technologies | IT Training & Cloud Services",
  description: "Master in-demand tech skills with Trivoxa Technologies. Industry-led courses in Full Stack, UI/UX, Cloud and more. 98% placement rate.",
  keywords: "IT training, web development, cloud computing, UI/UX design, digital marketing, Trivoxa",
  ogTitle: "Trivoxa Technologies | IT Training & Cloud Services",
  ogDescription: "Master in-demand tech skills with Trivoxa Technologies. 98% placement rate. 15,000+ students trained.",
  ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
  canonical: "https://trivoxatechnologis.vercel.app",
};

export default function usePageMeta(seo = {}) {
  const title        = seo.title        || DEFAULT.title;
  const description  = seo.description  || DEFAULT.description;
  const keywords     = seo.keywords     || DEFAULT.keywords;
  const ogTitle      = seo.ogTitle      || title;
  const ogDescription= seo.ogDescription|| description;
  const ogImage      = seo.ogImage      || DEFAULT.ogImage;
  const canonical    = seo.canonical    || DEFAULT.canonical;
  const twitterTitle = seo.twitterTitle || ogTitle;
  const twitterDesc  = seo.twitterDescription || ogDescription;

  useEffect(() => {

    // ── <title> ──────────────────────────────────────────────
    document.title = title;

    // ── helper: <meta name="x"> ──────────────────────────────
    const setName = (name, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    // ── helper: <meta property="x"> ─────────────────────────
    const setProp = (prop, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    // ── Standard ─────────────────────────────────────────────
    setName("title",       title);
    setName("description", description);
    setName("keywords",    keywords);
    setName("robots",      "index, follow");

    // ── Open Graph ───────────────────────────────────────────
    setProp("og:title",       ogTitle);
    setProp("og:description", ogDescription);
    setProp("og:image",       ogImage);
    setProp("og:url",         canonical);
    setProp("og:type",        "website");
    setProp("og:site_name",   "Trivoxa Technologies");

    // ── Twitter ──────────────────────────────────────────────
    setName("twitter:card",        "summary_large_image");
    setName("twitter:title",       twitterTitle);
    setName("twitter:description", twitterDesc);
    setName("twitter:image",       ogImage);

    // ── Canonical ────────────────────────────────────────────
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.href = canonical;

  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical, twitterTitle, twitterDesc]);
}
