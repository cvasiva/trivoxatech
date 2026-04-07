import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import {
  MdApps, MdDesignServices, MdCode, MdDeveloperMode,
  MdBarChart, MdCloud, MdLayersClear,
  MdCampaign, MdTerminal, MdTableChart
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import staticD from "../data/blogsData.json";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";
import usePageMeta from "../hooks/usePageMeta";

const toSlug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const POSTS_PER_PAGE = 5;

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function HeroSection({ d }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 items-start sm:items-center pt-8 pb-6 sm:pt-10 sm:pb-8 md:pt-14 md:pb-10">
      <div className="w-full sm:max-w-xl">
        <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-2">
          {d.hero.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
          {d.hero.title}{" "}
          <span className="text-indigo-600">{d.hero.highlight}</span>
        </h1>
        <p className="text-gray-500 mt-3 text-sm sm:text-base md:text-lg leading-relaxed">
          {d.hero.paragraph}
        </p>
      </div>
      <div className="flex items-center gap-3 border rounded-2xl px-5 py-3 shadow-sm bg-white w-full sm:w-auto shrink-0">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
          <FaArrowTrendUp className="text-indigo-600 text-lg" />
        </div>
        <div>
          <p className="font-bold text-2xl text-gray-900">{d.hero.statsValue}</p>
          <p className="text-xs text-gray-400 tracking-widest uppercase">{d.hero.statsLabel}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CATEGORY ICONS MAP
───────────────────────────────────────── */
const CATEGORY_ICONS = {
  "All Topics":          MdApps,
  "UI Development":      MdDesignServices,
  "ReactJS Development": MdCode,
  "Angular Development": MdDeveloperMode,
  "Data Science":        MdBarChart,
  "Cloud Computing":     MdCloud,
  "Java Full Stack":     MdLayersClear,
  "Full Stack":          MdCode,
  "Digital Marketing":   MdCampaign,
  "Python Programming":  MdTerminal,
  "Database":            MdTableChart,
};

/* ─────────────────────────────────────────
   CATEGORY FILTER (full-width, wraps)
───────────────────────────────────────── */
function CategoryFilter({ active, onChange, blogs, categoriesData }) {
  // Count actual posts per tag
  const counts = blogs.reduce((acc, b) => {
    acc[b.subtitle] = (acc[b.subtitle] || 0) + 1;
    return acc;
  }, {});

  // Use JSON categories order, replace counts with real post counts
  const categories = categoriesData.map((cat) => ({
    name: cat.name,
    count: cat.name === "All Topics" ? blogs.length : (counts[cat.name] || 0),
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Filter by Topic
      </p>
      <div className="flex flex-wrap gap-2">
        {categories.map(({ name, count }) => {
          const Icon = CATEGORY_ICONS[name];
          return (
            <button
              key={name}
              onClick={() => onChange(name)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                active === name
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-gray-50 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
              }`}
            style={active !== name ? { color: "#6b7280" } : {}}
            >
              {Icon && <Icon className="text-sm shrink-0" />}
              {name}
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-gray-100 text-[#6b7280]">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FEATURED POST
───────────────────────────────────────── */
function FeaturedPost({ blogs }) {
  const navigate = useNavigate();
  const featured = blogs[0];
  if (!featured) return null;
  return (
    <div
      className="border border-gray-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-sm bg-white cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/blogs/${toSlug(featured.title)}`)}
    >
      <img
        src={featured.img}
        alt={featured.title}
        className="w-full h-52 sm:h-64 md:h-full object-cover"
      />
      <div className="p-5 sm:p-7 md:p-10 flex flex-col justify-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
            Featured Post
          </span>
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
            {featured.tag}
          </span>
          <span className="text-gray-400 text-xs">{featured.date}</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug text-gray-900">
          {featured.title}
        </h2>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-3">
          {featured.desc}
        </p>
        <div className="flex items-center justify-between pt-3 border-t flex-wrap gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={featured.avatar}
              alt={featured.author}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">{featured.author}</p>
              <p className="text-xs text-gray-400">{featured.read}</p>
            </div>
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/blogs/${toSlug(featured.title)}`);
            }}
          >
            Read Article →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 animate-pulse">
      <div className="w-full sm:w-40 md:w-44 h-44 sm:h-28 md:h-32 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex flex-col justify-between w-full gap-3">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="h-5 w-24 bg-gray-200 rounded-full" />
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
          </div>
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-4/5 bg-gray-200 rounded" />
          <div className="h-3 w-3/5 bg-gray-100 rounded" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}


function BlogList({ blogs, loading, listRef }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  // Reset page to 1 whenever the blogs list changes (category switch)
  const blogsKey = blogs.map((b) => b.id).join(",");
  useEffect(() => { setPage(1); }, [blogsKey]);

  const sorted = [...blogs].sort((a, b) => {
    if (sort === "oldest") return a.id - b.id;
    if (sort === "trending") return b.read.localeCompare(a.read);
    return b.id - a.id;
  });

  const totalPages = Math.ceil(sorted.length / POSTS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const handleSort = (s) => { setSort(s); setPage(1); listRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const handlePage = (p) => { setPage(p); listRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Latest Articles
          <span className="ml-2 text-xs font-normal text-gray-400">({blogs.length})</span>
        </h2>
        <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
          {["latest", "trending", "oldest"].map((s) => (
            <button
              key={s}
              onClick={() => handleSort(s)}
              className={`capitalize transition font-medium ${sort === s ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        Array.from({ length: POSTS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm bg-white rounded-2xl border">
          No articles found for this category.
        </div>
      ) : (
        paginated.map((blog) => (
          <div
            key={blog.id}
            onClick={() => navigate(`/blogs/${toSlug(blog.title)}`)}
            className="flex flex-col sm:flex-row gap-4 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
          >
            <img
              src={blog.img}
              alt={blog.title}
              className="w-full sm:w-40 md:w-44 h-44 sm:h-28 md:h-32 rounded-xl object-cover shrink-0"
            />
            <div className="flex flex-col justify-between w-full gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-indigo-100">
                    {blog.tag}
                  </span>
                  <span className="text-gray-400 text-xs">⏱ {blog.read}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
                  {blog.desc}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src={blog.avatar}
                    alt={blog.author}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                  />
                  <p className="text-xs font-medium text-gray-600">{blog.author}</p>
                </div>
                <p className="text-xs text-gray-400">{blog.date}</p>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <button
              onClick={() => handlePage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border text-xs sm:text-sm disabled:opacity-40 hover:bg-gray-100 transition"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePage(p)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition ${page === p
                    ? "bg-indigo-600 text-white"
                    : "border hover:bg-gray-100 text-gray-600"
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border text-xs sm:text-sm disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Next →
            </button>
          </div>
          <p className="text-center text-xs text-gray-400">
            Page {page} of {totalPages} — {blogs.length} articles
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────── */
function Sidebar({ d, blogs, activeCategory, onCategoryChange }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const counts = blogs.reduce((acc, b) => {
    acc[b.subtitle] = (acc[b.subtitle] || 0) + 1;
    return acc;
  }, {});

  // Use staticD categories for consistent order + real counts
  const categories = staticD.categories.map((cat) => ({
    name: cat.name,
    count: cat.name === "All Topics" ? blogs.length : (counts[cat.name] || 0),
  }));

  const tags = staticD.tags;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) { setSearchError("Please enter a search term."); return; }
    setSearchError("");
    navigate(`/blogs?q=${encodeURIComponent(search.trim())}`);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address."); return;
    }
    setEmailError(""); setSubscribed(true); setEmail("");
  };

  return (
    <div className="space-y-5">

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Search Articles</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSearchError(""); }}
            placeholder={d.sidebar.searchPlaceholder}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <FiSearch />
          </button>
        </form>
        {searchError && <p className="text-red-500 text-xs mt-1.5">{searchError}</p>}
      </div>

      {/* Categories */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Categories</h3>
        <ul className="divide-y divide-gray-50">
          {categories.map(({ name, count }) => {
            const Icon = CATEGORY_ICONS[name];
            return (
              <li
                key={name}
                onClick={() => onCategoryChange(name)}
                className={`flex items-center justify-between py-2 cursor-pointer group transition-colors`}
              >
                <span className={`text-xs sm:text-sm flex items-center gap-2 transition-colors ${
                  activeCategory === name
                    ? "text-indigo-600 font-semibold"
                    : "font-medium"
                }`}
                style={activeCategory !== name ? { color: "#6b7280" } : {}}>
                  {Icon
                    ? <Icon className={`text-base shrink-0 ${
                        activeCategory === name ? "text-indigo-600" : ""
                      }`}
                      style={activeCategory !== name ? { color: "#6b7280" } : {}}
                    />
                    : <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        activeCategory === name ? "bg-indigo-600" : "bg-[#6b7280]"
                      }`} />
                  }
                  {name}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  activeCategory === name
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100"
                }`}
                style={activeCategory !== name ? { color: "#6b7280" } : {}}>
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onCategoryChange(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${activeCategory === tag
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white"
                }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-sm">
        <h3 className="font-bold text-sm sm:text-base mb-1">{d.sidebar.newsletterTitle}</h3>
        <p className="text-indigo-100 text-xs mb-4 leading-relaxed">{d.sidebar.newsletterDesc}</p>
        {subscribed ? (
          <p className="text-white font-semibold text-sm bg-white/20 rounded-lg px-4 py-2 text-center">
            ✓ You're subscribed!
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              placeholder="your@email.com"
              className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            {emailError && <p className="text-red-200 text-xs">{emailError}</p>}
            <button
              type="submit"
              className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-lg text-xs sm:text-sm hover:bg-indigo-50 transition"
            >
              {d.sidebar.subscribeBtn}
            </button>
            <p className="text-indigo-200 text-xs text-center">{d.sidebar.subscribePrivacy}</p>
          </form>
        )}
      </div>

      {/* Careers CTA */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm text-center">
        <h3 className="font-bold text-gray-900 mb-1.5 text-sm sm:text-base">{d.sidebar.careersTitle}</h3>
        <p className="text-gray-500 text-xs mb-4 leading-relaxed">{d.sidebar.careersDesc}</p>
        <button
          onClick={() => navigate("/careers")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition w-full"
        >
          {d.sidebar.careersBtn}
        </button>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────── */
function CTASection({ cta }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl overflow-hidden relative">
      <img
        src={cta.img}
        alt="Students learning"
        className="w-full h-44 sm:h-56 md:h-72 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/70 flex flex-col items-center justify-center text-center px-4 sm:px-8 gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white max-w-xl leading-snug">
          {cta.heading}
        </h2>
        <p className="text-indigo-100 text-xs sm:text-sm md:text-base max-w-lg leading-relaxed hidden sm:block">
          {cta.paragraph}
        </p>
        <div className="flex flex-row gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/courses")}
            className="bg-white text-indigo-700 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-indigo-50 transition text-xs sm:text-sm"
          >
            {cta.primaryBtn}
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="border border-white text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-white/10 transition text-xs sm:text-sm"
          >
            {cta.secondaryBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Blogs() {
  const d = usePageData("blogsData", staticD);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (d) setLoading(false); }, [d]);
  const pageData = d || staticD;
  const blogs = (pageData.posts || staticD.posts).map((b) => ({
    ...b,
    tag: b.tag.trim(),
  }));
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const listRef = useRef(null);

  usePageMeta(pageData.seo);

  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Trivoxa Insights",
      "url": "https://trivoxatechnologies.in/blogs",
      "description": staticD.seo.description,
      "publisher": { "@type": "Organization", "name": "Trivoxa Technologies", "url": "https://trivoxatech.com" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trivoxatech.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://trivoxatech.com/blogs" },
      ],
    },
  ]);

  const filteredBlogs =
    activeCategory === "All Topics"
      ? blogs
      : blogs.filter((b) => b.subtitle === activeCategory.trim());

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageLoader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <HeroSection d={pageData} />



        <div className="mb-6 sm:mb-8">
          <FeaturedPost blogs={filteredBlogs} />
        </div>

        <div className="mb-8 sm:mb-10">
          <CTASection cta={pageData.cta} />
        </div>
        <div className="mb-6 sm:mb-8" ref={listRef}>
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
            blogs={blogs}
            categoriesData={staticD.categories}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-12 sm:pb-16">
          <div className="col-span-1 lg:col-span-2">
            <BlogList blogs={filteredBlogs} loading={loading} listRef={listRef} />
          </div>
          <div className="col-span-1 lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Sidebar
                d={pageData}
                blogs={blogs}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
