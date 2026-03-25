import { Helmet } from "react-helmet-async";

const DEFAULT = {
  title: "Trivoxa Technologies | IT Training & Cloud Services",
  description: "Master in-demand tech skills with Trivoxa Technologies. Industry-led courses in Full Stack, UI/UX, Cloud and more. 98% placement rate.",
  keywords: "IT training, web development, cloud computing, UI/UX design, digital marketing, Trivoxa",
  ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
  canonical: "https://trivoxatechnologis.vercel.app",
};

export default function usePageMeta(seo = {}) {
  const title         = seo.title         || DEFAULT.title;
  const description   = seo.description   || DEFAULT.description;
  const keywords      = seo.keywords      || DEFAULT.keywords;
  const ogTitle       = seo.ogTitle       || title;
  const ogDescription = seo.ogDescription || description;
  const ogImage       = seo.ogImage       || DEFAULT.ogImage;
  const canonical     = seo.canonical     || DEFAULT.canonical;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="title"       content={title} />
      <meta name="description" content={description} />
      <meta name="keywords"    content={keywords} />
      <meta name="robots"      content="index, follow" />
      <link rel="canonical"    href={canonical} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={canonical} />
      <meta property="og:site_name"   content="Trivoxa Technologies" />
      <meta property="og:title"       content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image"       content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:url"         content={canonical} />
      <meta name="twitter:title"       content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image"       content={ogImage} />
    </Helmet>
  );
}
