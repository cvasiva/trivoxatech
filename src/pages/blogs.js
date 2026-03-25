import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import staticD from "../data/blogsData.json";
import staticBlogDetail from "../data/blogDetailData.json";
import useSchema from "../hooks/useSchema";
import usePageData from "../hooks/usePageData";

const POSTS_PER_PAGE = 2;

/* ── HERO ── */
function HeroSection({ d }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center py-10 md:py-14">
      <div className="max-w-xl">
        <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-2">
          {d.hero.eyebrow}
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
          {d.hero.title} <span className="text-indigo-600">{d.hero.highlight}</span>
        </h1>
        <p className="text-gray-500 mt-4 text-base md:text-lg leading-relaxed">
          {d.hero.paragraph}
        </p>
      </div>
      <div className="flex items-center gap-4 border rounded-2xl px-6 py-4 shadow-sm shrink-0 bg-white">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
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

/* ── FEATURED POST ── */
function FeaturedPost({ blogs }) {
  const navigate = useNavigate();
  const featured = blogs[0];
  if (!featured) return null;
  return (
    <div
      className="border rounded-2xl overflow-hidden grid md:grid-cols-2 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/blogs/${featured.id}`)}
    >
      <img src={featured.img} alt="Featured" className="w-full h-64 md:h-full object-cover" />
      <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">Featured Post</span>
          <span className="text-gray-400 text-xs">{featured.date}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold leading-snug text-gray-900">{featured.title}</h2>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">{featured.desc}</p>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3">
            <img src={featured.avatar} alt={featured.author} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{featured.author}</p>
              <p className="text-xs text-gray-400">{featured.read}</p>
            </div>
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            onClick={(e) => { e.stopPropagation(); navigate(`/blogs/${featured.id}`); }}
          >
            Read Article →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── BLOG LIST with PAGINATION ── */
function BlogList({ blogs }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const sorted = [...blogs].sort((a, b) => {
    if (sort === "oldest") return a.id - b.id;
    if (sort === "trending") return b.read.localeCompare(a.read);
    return b.id - a.id;
  });

  const totalPages = Math.ceil(sorted.length / POSTS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const handleSort = (s) => { setSort(s); setPage(1); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b">
        <h2 className="text-xl font-bold text-gray-900">Latest Articles</h2>
        <div className="flex gap-5 text-sm">
          {["latest", "trending", "oldest"].map((s) => (
            <span key={s} onClick={() => handleSort(s)}
              className={`cursor-pointer capitalize transition ${sort === s ? "text-indigo-600 font-semibold" : "text-gray-400 hover:text-gray-600"}`}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {paginated.map((blog) => (
        <div key={blog.id} onClick={() => navigate(`/blogs/${blog.id}`)}
          className="flex flex-col sm:flex-row gap-5 bg-white border rounded-2xl p-5 md:p-6 hover:shadow-md transition-shadow cursor-pointer">
          <img src={blog.img} alt={blog.title} className="w-full sm:w-44 h-40 sm:h-32 rounded-xl object-cover shrink-0" />
          <div className="flex flex-col justify-between w-full gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-indigo-100 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs font-semibold">{blog.tag}</span>
                <span className="text-gray-400 text-xs">⏱ {blog.read}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base md:text-lg leading-snug">{blog.title}</h3>
              <p className="text-gray-500 text-sm mt-1.5 line-clamp-2 leading-relaxed">{blog.desc}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <img src={blog.avatar} alt={blog.author} className="w-7 h-7 rounded-full object-cover" />
                <p className="text-xs font-medium text-gray-700">{blog.author}</p>
              </div>
              <p className="text-xs text-gray-400">{blog.date}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center gap-2 pt-4">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
          className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 transition">
          ← Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => setPage(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === p ? "bg-indigo-600 text-white" : "border hover:bg-gray-100 text-gray-600"}`}>
            {p}
          </button>
        ))}
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 transition">
          Next →
        </button>
      </div>
      <p className="text-center text-xs text-gray-400">Page {page} of {totalPages} — {blogs.length} articles total</p>
    </div>
  );
}

/* ── SIDEBAR ── */
function Sidebar({ d }) {
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) { setSearchError("Please enter a search term."); return; }
    if (search.trim().length < 3) { setSearchError("Search must be at least 3 characters."); return; }
    setSearchError("");
  };

  const handleSubscribe = () => {
    if (!email.trim()) { setEmailError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Please enter a valid email address."); return; }
    setEmailError("");
    setSubscribed(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Search</p>
        <form onSubmit={handleSearch}>
          <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 transition ${searchError ? "border-red-400" : "focus-within:border-indigo-400"}`}>
            <FiSearch className="text-gray-400 shrink-0" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setSearchError(""); }}
              placeholder={d.sidebar.searchPlaceholder}
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400" />
          </div>
          {searchError && <p className="text-red-500 text-xs mt-1">{searchError}</p>}
          <button type="submit" className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition">
            {d.sidebar.searchBtn}
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Categories</p>
        <ul className="space-y-3">
          {d.categories.map((item, i) => (
            <li key={i} className="flex justify-between items-center text-sm text-gray-600 hover:text-indigo-600 cursor-pointer transition">
              <span>› {item.name}</span>
              <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">{item.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <p className="font-bold text-gray-900 text-sm mb-1">{d.sidebar.newsletterTitle}</p>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">{d.sidebar.newsletterDesc}</p>
        {subscribed ? (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">
            <p className="text-green-700 text-sm font-semibold">🎉 You're subscribed!</p>
            <p className="text-green-600 text-xs mt-1">Check your inbox for a confirmation.</p>
          </div>
        ) : (
          <>
            <input value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              className={`w-full border bg-white rounded-lg px-3 py-2 text-sm mb-1 outline-none transition ${emailError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-indigo-400"}`}
              placeholder="Enter your email" />
            {emailError && <p className="text-red-500 text-xs mb-2">{emailError}</p>}
            <button onClick={handleSubscribe} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition mt-1">
              {d.sidebar.subscribeBtn}
            </button>
            <p className="text-[10px] text-gray-400 mt-2 text-center">{d.sidebar.subscribePrivacy}</p>
          </>
        )}
      </div>

      <div className="bg-white border rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Popular Tags</p>
        <div className="flex flex-wrap gap-2">
          {d.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 px-3 py-1.5 rounded-full cursor-pointer transition">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-xl mb-3">👤</div>
        <p className="font-bold text-gray-900 text-sm">{d.sidebar.careersTitle}</p>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{d.sidebar.careersDesc}</p>
        <button className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition">{d.sidebar.careersBtn}</button>
      </div>
    </div>
  );
}

/* ── CTA ── */
function CTASection({ d }) {
  return (
    <div className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl overflow-hidden grid md:grid-cols-2 shadow-lg">
      <div className="p-10 md:p-14 flex flex-col justify-center gap-5">
        <h2 className="text-2xl md:text-3xl font-extrabold leading-snug">{d.cta.heading}</h2>
        <p className="text-indigo-100 text-sm md:text-base leading-relaxed">{d.cta.paragraph}</p>
        <div className="flex gap-3 flex-wrap">
          <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-xl text-sm font-semibold transition">{d.cta.primaryBtn}</button>
          <button className="bg-white/20 hover:bg-white/30 px-6 py-2.5 rounded-xl text-sm font-semibold transition">{d.cta.secondaryBtn}</button>
        </div>
      </div>
      <img src={d.cta.img} alt="Team" className="w-full h-64 md:h-full object-cover" />
    </div>
  );
}

/* ── PAGE ── */
export default function BlogPage() {
  const d = usePageData("blogsData", staticD);
  const blogDetail = usePageData("blogDetailData", staticBlogDetail);
  const blogs = blogDetail?.posts || staticBlogDetail.posts;
  useSchema([
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Trivoxa Insights",
      "url": "https://trivoxatech.com/blogs",
      "description": d.hero.paragraph,
      "publisher": { "@type": "Organization", "name": "Trivoxa Technologies", "url": "https://trivoxatech.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Trivoxa Blog Posts",
      "itemListElement": blogs.map((b, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": b.title,
        "url": `https://trivoxatech.com/blogs/${b.id}`
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trivoxatech.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://trivoxatech.com/blogs" }
      ]
    }
  ]);
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection d={d} />
        <FeaturedPost blogs={blogs} />
        <div className="mt-10 grid lg:grid-cols-3 gap-8 pb-16">
          <div className="lg:col-span-2"><BlogList blogs={blogs} /></div>
          <div className="lg:col-span-1"><Sidebar d={d} /></div>
        </div>
        <CTASection d={d} />
      </div>
      <div className="mt-16"><Footer /></div>
    </div>
  );
}
