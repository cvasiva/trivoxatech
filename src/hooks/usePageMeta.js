import { useEffect } from "react";

const DEFAULT = {
  title: "Trivoxa Technologies | IT Training & Cloud Services",
  description: "Master in-demand tech skills with Trivoxa Technologies. Industry-led courses in Full Stack, UI/UX, Cloud and more. 98% placement rate.",
  keywords: "IT training, web development, cloud computing, UI/UX design, digital marketing, Trivoxa",
  ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
  canonical: "https://trivoxatechnologis.vercel.app",
};

function setMeta(selector, attr, value) {
  let el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export default function usePageMeta(seo = {}) {
  const title         = seo.title         || DEFAULT.title;
  const description   = seo.description   || DEFAULT.description;
  const keywords      = seo.keywords      || DEFAULT.keywords;
  const ogTitle       = seo.ogTitle       || title;
  const ogDescription = seo.ogDescription || description;
  const ogImage       = seo.ogImage       || DEFAULT.ogImage;
  const canonical     = seo.canonical     || DEFAULT.canonical;

  useEffect(() => {
    document.title = title;
    setMeta('meta[name="title"]',           "content", title);
    setMeta('meta[name="description"]',     "content", description);
    setMeta('meta[name="keywords"]',        "content", keywords);
    setMeta('meta[property="og:title"]',    "content", ogTitle);
    setMeta('meta[property="og:description"]', "content", ogDescription);
    setMeta('meta[property="og:image"]',    "content", ogImage);
    setMeta('meta[property="og:url"]',      "content", canonical);
    setMeta('meta[name="twitter:title"]',   "content", ogTitle);
    setMeta('meta[name="twitter:description"]', "content", ogDescription);
    setMeta('meta[name="twitter:image"]',   "content", ogImage);
    setMeta('meta[name="twitter:url"]',     "content", canonical);
    setMeta('link[rel="canonical"]',        "href",    canonical);
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical]);
}
