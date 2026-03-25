const SEO = {
  "/": {
    title: "Best Training Institute in Bangalore - Trivoxa Technologies",
    description: "Master in-demand tech skills with Trivoxa. Industry-led courses in Full Stack, UI/UX, Cloud, and more. 98% placement rate.",
    keywords: "IT training, web development courses, cloud computing, UI/UX design, tech education",
    ogTitle: "Training Institute in Bangalore - Trivoxa Technologies",
    ogDescription: "Empower your career with industry-recognized certifications or scale your business with bespoke IT development services.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/",
  },
  "/about": {
    title: "About Trivoxa Technologies | Our Mission & Team",
    description: "Learn about Trivoxa's mission to democratize IT education. Meet our team of industry veterans and discover our journey since 2018.",
    keywords: "about Trivoxa, IT education company, tech training team, company mission",
    ogTitle: "About Trivoxa Technologies",
    ogDescription: "Bridging the gap between ambition and excellence in IT education and enterprise solutions.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/about",
  },
  "/courses": {
    title: "IT Courses & Certifications | Trivoxa Technologies",
    description: "Browse 12+ expert-designed courses in web development, UI/UX, cloud, data science and more. Enroll today and advance your career.",
    keywords: "IT courses, web development training, cloud certification, UI/UX course, data science",
    ogTitle: "IT Courses & Certifications | Trivoxa",
    ogDescription: "Industry-led programs built for real-world outcomes. 98% placement rate.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/courses",
  },
  "/services": {
    title: "Enterprise IT Services | Web Dev, Design & Marketing | Trivoxa",
    description: "Trivoxa provides bespoke web development, UI/UX design, and digital marketing services for modern enterprises. 250+ projects delivered.",
    keywords: "enterprise IT services, web development company, UI/UX design agency, digital marketing services",
    ogTitle: "Enterprise IT Services | Trivoxa Technologies",
    ogDescription: "Scale your business with precision technology. Bespoke software development and digital solutions.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/services",
  },
  "/contact": {
    title: "Contact Trivoxa Technologies | Get in Touch",
    description: "Contact Trivoxa for IT training, enterprise services, or career counseling. Offices in Silicon Valley and London. 24hr response guaranteed.",
    keywords: "contact Trivoxa, IT training inquiry, enterprise IT contact, tech support",
    ogTitle: "Contact Trivoxa Technologies",
    ogDescription: "Let's scale your tech future together. Our experts are ready to guide you.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/contact",
  },
  "/blogs": {
    title: "Tech Blog & Insights | Trivoxa Technologies",
    description: "Explore the latest articles on web development, cloud engineering, AI, DevOps, and IT career tips from Trivoxa's expert team.",
    keywords: "tech blog, web development articles, cloud engineering, AI insights, DevOps tips",
    ogTitle: "Trivoxa Insights | Tech Blog",
    ogDescription: "Weekly updates on industry trends, career tips, and technological breakthroughs from Trivoxa.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/blogs",
  },
  "/portfolio": {
    title: "Portfolio & Case Studies | Trivoxa Technologies",
    description: "Explore Trivoxa's portfolio of 150+ high-impact projects across FinTech, Healthcare, E-commerce, and EdTech industries.",
    keywords: "IT portfolio, case studies, web development projects, digital transformation examples",
    ogTitle: "Portfolio & Case Studies | Trivoxa",
    ogDescription: "Turning complex challenges into measurable success. 150+ global projects delivered.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/portfolio",
  },
  "/careers": {
    title: "Careers at Trivoxa Technologies | Join Our Team",
    description: "Explore open roles at Trivoxa. We're hiring engineers, designers, instructors and marketers. Remote-first culture with competitive benefits.",
    keywords: "Trivoxa careers, tech jobs, remote developer jobs, IT instructor jobs, hiring",
    ogTitle: "Careers at Trivoxa Technologies",
    ogDescription: "Build the future of tech education. Join our remote-first team of innovators and educators.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/careers",
  },
  "/servicesquote": {
    title: "Get a Custom IT Services Quote | Trivoxa Technologies",
    description: "Get a custom quote for web development, UI/UX design and digital marketing services from Trivoxa Technologies.",
    keywords: "IT services quote, web development quote, custom software quote",
    ogTitle: "Get a Quote | Trivoxa Technologies",
    ogDescription: "Get a tailored proposal for your project from Trivoxa's expert team.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/servicesquote",
  },
  "/coursedetails": {
    title: "Course Details | Trivoxa Technologies",
    description: "Get full details on Trivoxa's industry-led courses — syllabus, tools, career outcomes, certificate, and enrollment options.",
    keywords: "course details, IT course syllabus, tech certification, career outcomes",
    ogTitle: "Course Details | Trivoxa",
    ogDescription: "Industry-certified courses with hands-on projects, expert mentors, and guaranteed placement support.",
    ogImage: "https://trivoxatechnologis.vercel.app/logo512.png",
    canonical: "https://trivoxatech.com/coursedetails",
  },
};

function esc(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function injectMeta(html, seo) {
  const { title, description, keywords, ogTitle, ogDescription, ogImage, canonical } = seo;

  html = html.replace(/(<title[^>]*>)[^<]*(<\/title>)/, `$1${esc(title)}$2`);

  const replacePairs = [
    [/(<meta\s[^>]*name="title"[^>]*content=")[^"]*(")/i,           esc(title)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="title")/i,           esc(title)],
    [/(<meta\s[^>]*name="description"[^>]*content=")[^"]*(")/i,     esc(description)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="description")/i,     esc(description)],
    [/(<meta\s[^>]*name="keywords"[^>]*content=")[^"]*(")/i,        esc(keywords)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="keywords")/i,        esc(keywords)],
    [/(<meta\s[^>]*property="og:title"[^>]*content=")[^"]*(")/i,    esc(ogTitle)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*property="og:title")/i,    esc(ogTitle)],
    [/(<meta\s[^>]*property="og:description"[^>]*content=")[^"]*(")/i, esc(ogDescription)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*property="og:description")/i, esc(ogDescription)],
    [/(<meta\s[^>]*property="og:image"[^>]*content=")[^"]*(")/i,    esc(ogImage)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*property="og:image")/i,    esc(ogImage)],
    [/(<meta\s[^>]*property="og:url"[^>]*content=")[^"]*(")/i,      esc(canonical)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*property="og:url")/i,      esc(canonical)],
    [/(<meta\s[^>]*name="twitter:title"[^>]*content=")[^"]*(")/i,   esc(ogTitle)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:title")/i,   esc(ogTitle)],
    [/(<meta\s[^>]*name="twitter:description"[^>]*content=")[^"]*(")/i, esc(ogDescription)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:description")/i, esc(ogDescription)],
    [/(<meta\s[^>]*name="twitter:image"[^>]*content=")[^"]*(")/i,   esc(ogImage)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:image")/i,   esc(ogImage)],
    [/(<meta\s[^>]*name="twitter:url"[^>]*content=")[^"]*(")/i,     esc(canonical)],
    [/(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:url")/i,     esc(canonical)],
    [/(<link\s[^>]*rel="canonical"[^>]*href=")[^"]*(")/i,           esc(canonical)],
    [/(<link\s[^>]*href=")[^"]*("[^>]*rel="canonical")/i,           esc(canonical)],
  ];

  for (const [re, val] of replacePairs) {
    html = html.replace(re, `$1${val}$2`);
  }

  return html;
}

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip static assets
  if (/\.(js|css|png|jpg|jpeg|svg|ico|json|woff|woff2|ttf|map|txt)$/.test(pathname)) {
    return;
  }

  // Match route
  let seo = SEO[pathname];
  if (!seo) {
    const prefix = Object.keys(SEO).find((k) => k !== "/" && pathname.startsWith(k));
    seo = prefix ? SEO[prefix] : SEO["/"];
  }

  // Fetch the original index.html and inject meta
  return fetch(new URL("/index.html", request.url)).then((res) =>
    res.text().then((html) => {
      const injected = injectMeta(html, seo);
      return new Response(injected, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    })
  );
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|static|logo192.png|logo512.png|manifest.json|robots.txt).*)",
};
